import uuid
from asyncio import get_running_loop, run_coroutine_threadsafe, sleep

from fastapi import APIRouter, Body, Depends, Query
from pydantic import BaseModel
from sqlalchemy import delete, func, text
from sqlalchemy.orm import Session

from backend.db import database
from backend.routes.companies import (CompanyBatchOutput, CompanyOutput,
                                      fetch_companies_with_liked)

router = APIRouter(
    prefix="/collections",
    tags=["collections"],
)

context = {'jobs': {}}


class CompanyMetadata(BaseModel):
    id: uuid.UUID
    company_name: str


class CompanyCollectionMetadata(BaseModel):
    id: uuid.UUID
    collection_name: str


class CompanyCollectionOutput(CompanyBatchOutput, CompanyCollectionMetadata):
    pass


class Status(BaseModel):
    id: str
    collection: str
    status: str
    count: int
    total: int


@router.get("", response_model=list[CompanyCollectionMetadata])
def get_all_collection_metadata(
    db: Session = Depends(database.get_db),
):
    collections = db.query(database.CompanyCollection).all()

    return [
        CompanyCollectionMetadata(
            id=collection.id,
            collection_name=collection.collection_name,
        )
        for collection in collections
    ]


@router.get("/{collection_id}", response_model=CompanyCollectionOutput)
def get_company_collection_by_id(
    collection_id: uuid.UUID,
    offset: int = Query(
        0, description="The number of items to skip from the beginning"
    ),
    limit: int = Query(10, description="The number of items to fetch"),
    db: Session = Depends(database.get_db),
):
    query = (
        db.query(database.CompanyCollectionAssociation, database.Company)
        .join(database.Company)
        .filter(database.CompanyCollectionAssociation.collection_id == collection_id)
    )

    total_count = query.with_entities(func.count()).scalar()

    results = query.offset(offset).limit(limit).all()
    companies = fetch_companies_with_liked(
        db, [company.id for _, company in results])

    return CompanyCollectionOutput(
        id=collection_id,
        collection_name=db.query(database.CompanyCollection)
        .get(collection_id)
        .collection_name,
        companies=companies,
        total=total_count,
    )


# Add company to company-collection association database
async def like_company(
    company_ids: list[str],
    collection_name: str,
    job_id: str,
    db: Session = Depends(database.get_db)
):
    # Get collection id using name
    liked_list = (
        db.query(database.CompanyCollection)
        .filter(database.CompanyCollection.collection_name == collection_name)
        .first()
    )
    job_info = context['jobs'][job_id]
    job_info['id'] = job_id
    job_info['total'] = len(company_ids)  # Total add operations to perform
    job_info['collection'] = collection_name
    job_info['action'] = 'add'
    for count, company_id in enumerate(company_ids, 1):
        job_info['count'] = count  # Update count of adds completed
        job_info['status'] = 'in_progress'
        liked_associations = (
            db.query(database.CompanyCollectionAssociation)
            .filter(database.CompanyCollectionAssociation.company_id == company_id)
            .filter(
                database.CompanyCollectionAssociation.collection_id == liked_list.id
            ).all()
        )
        # Add if it doesn't exist in table already
        if len(liked_associations) == 0:
            association = database.CompanyCollectionAssociation(
                company_id=company_id,
                collection_id=liked_list.id
            )
            db.add(association)
        await sleep(1)
        db.commit()
    liked_associations = (
        db.query(database.CompanyCollectionAssociation)
        .filter(database.CompanyCollectionAssociation.company_id == company_ids[0])
        .filter(
            database.CompanyCollectionAssociation.collection_id == liked_list.id
        ).all()
    )
    if len(liked_associations) == 0:
        association = database.CompanyCollectionAssociation(
            company_id=company_ids[0],
            collection_id=liked_list.id
        )
        db.add(association)
    job_info['status'] = 'done'  # Mark as done
    db.commit()


# Remove company from company-collection association database
async def dislike_company(
    company_ids: list[str],
    collection_name: str,
    job_id: str,
    db: Session = Depends(database.get_db)
):

    # Get collection id using name
    liked_list = (
        db.query(database.CompanyCollection)
        .filter(database.CompanyCollection.collection_name == collection_name)
        .first()
    )
    job_info = context['jobs'][job_id]
    job_info['id'] = job_id
    job_info['total'] = len(company_ids)  # Total delete operations to perform
    job_info['collection'] = collection_name
    job_info['action'] = 'remove'
    for count, company_id in enumerate(company_ids, 1):
        job_info['count'] = count
        job_info['status'] = 'in_progress'
        # Remove if it exists in table
        liked_associations = (
            db.query(database.CompanyCollectionAssociation)
            .filter(database.CompanyCollectionAssociation.company_id == company_id)
            .filter(
                database.CompanyCollectionAssociation.collection_id == liked_list.id
            ).first()
        )
        if liked_associations is not None:
            db.delete(liked_associations)
        await sleep(1)
        db.commit()
    liked_associations = (
        db.query(database.CompanyCollectionAssociation)
        .filter(database.CompanyCollectionAssociation.company_id == company_ids[0])
        .filter(
            database.CompanyCollectionAssociation.collection_id == liked_list.id
        ).first()
    )
    if liked_associations is not None:
        db.delete(liked_associations)
    job_info['status'] = 'done'  # Mark operation as done
    db.commit()


# Add to collection
@router.post("/{collection_name}/like")
async def add_company_collection_by_id(
    collection_name: str,
    companies: list[CompanyOutput] = Body(
        None, description="Add companies to like collection"),
    db: Session = Depends(database.get_db),
):
    id = str(uuid.uuid4())
    context['jobs'][id] = {}

    company_ids = []
    for company in companies:
        company_ids.append(company.id)

    # Run async operation to add to database otherwise it will take too long
    run_coroutine_threadsafe(like_company(
        company_ids, collection_name, id, db), loop=get_running_loop())
    db.commit()
    return {"id": id}


# Delete from collection
@router.delete("/{collection_name}/dislike")
async def add_company_collection_by_id(
    collection_name: str,
    companies: list[CompanyOutput] = Body(
        None, description="Remove companies from like collection"),
    db: Session = Depends(database.get_db),
):
    id = str(uuid.uuid4())
    context['jobs'][id] = {}
    company_ids = []
    for company in companies:
        company_ids.append(company.id)

    # Run async operation to remove from database otherwise it will take too long
    run_coroutine_threadsafe(dislike_company(
        company_ids, collection_name, id, db), loop=get_running_loop())
    db.commit()
    return {"id": id}


# Get all operations statuses
@router.get("/{collection_id}/status")
def status(collection_id: str):
    print(context["jobs"])
    output = list(context['jobs'].values())
    print(output)
    return {"statuses": output}


# Add new collection
@router.post("/{collection_name}/add")
async def add_collection(
    collection_name: str,
    db: Session = Depends(database.get_db),
):
    # Check if collection name exists already
    collections = (
        db.query(database.CompanyCollection)
        .filter(database.CompanyCollection.collection_name == collection_name)
        .first()
    )
    print(collections)
    # Add if collection name doesn't exist already
    if collections is None:
        collection = database.CompanyCollection(
            collection_name=collection_name
        )
        db.add(collection)
        db.commit()
        return {"message": "Success"}
    return {"message": "Error : Collection Name Already Exists"}
