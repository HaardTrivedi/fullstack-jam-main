import { useNavigate } from 'react-router-dom';
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react";
import { getCollectionsById, ICompany, addToCollection, removeFromCollection, ICollection } from "../utils/jam-api";

const CompanyTable = (props: { selectedCollectionId: string, selectedCollectionName: string, collectionResponse: ICollection[] }) => {
  const [response, setResponse] = useState<ICompany[]>([]);
  const [total, setTotal] = useState<number>();
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState<ICompany[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [collection, setCollection] = useState<string>(props.collectionResponse[0].collection_name);


  const navigate = useNavigate();

  useEffect(() => {
    getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
      (newResponse) => {
        setResponse(newResponse.companies);
        setTotal(newResponse.total);
      }
    );
  }, [props.selectedCollectionId, offset, pageSize]);

  useEffect(() => {
    setOffset(0);
  }, [props.selectedCollectionId]);

  const handleLike = async () => {
    console.log(props.selectedCollectionId, selected);
    console.log(props.selectedCollectionId, selected);
    addToCollection("Liked Companies", selected);
    navigate('/status');
  }

  const handleDislike = async () => {
    console.log(props.selectedCollectionId, selected);
    removeFromCollection("Liked Companies", selected);
    navigate('/status');
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setOpen(false);
    console.log(props.selectedCollectionId, selected);
    addToCollection(collection, selected);
    navigate('/status');
  };

  const handleRemove = () => {
    console.log(props.selectedCollectionId, selected);
    removeFromCollection(props.selectedCollectionName, selected);
    navigate('/status');
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCollection(event.target.value);
  };

  return (
    <div style={{ height: 800, width: "100%" }}>
      <Button
        variant="contained"
        color="primary"
        disabled={!selected.length}
        sx={{ mb: 1, marginX: 2, width: 100 }}
        onClick={handleLike}
      >
        Like
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={!selected.length}
        sx={{ mb: 1, marginX: 2, width: 100 }}
        onClick={handleDislike}
      >
        Dislike
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={!selected.length}
        sx={{ mb: 1, marginX: 2, width: 250 }}
        onClick={handleClickOpen}
      >
        Add to Collection
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={props.collectionResponse[0].id==props.selectedCollectionId|| !selected.length}
        sx={{ mb: 1, marginX: 2, width: 250 }}
        onClick={handleRemove}
      >
        Remove from Collection
      </Button>

      <DataGrid
        rows={response}
        rowHeight={30}
        columns={[
          { field: "liked", headerName: "Liked", width: 90 },
          { field: "id", headerName: "ID", width: 90 },
          { field: "company_name", headerName: "Company Name", width: 200 },
        ]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        rowCount={total}
        pagination
        checkboxSelection
        paginationMode="server"
        onPaginationModelChange={(newMeta) => {
          setPageSize(newMeta.pageSize);
          setOffset(newMeta.page * newMeta.pageSize);
        }}
        onRowSelectionModelChange={(newSelectionModel) => {
          const selectedIDs = new Set(newSelectionModel);
          const selectedRows = response.filter((row) =>
            selectedIDs.has(row.id),
          );
          setSelected(selectedRows);
        }}
      />

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add to Custom Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose the custom Collection you would like to add the selected companies to
          </DialogContentText>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={collection}
            label="Collection"
            onChange={handleChange}
            defaultValue={props.collectionResponse[0].collection_name}
          >
            {props.collectionResponse?.map((collection) => {
              return (
                <MenuItem value={collection.collection_name}>{collection.collection_name}</MenuItem>)
            })
            }</Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd} type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompanyTable;
