import axios from 'axios';

export interface ICompany {
    id: number;
    company_name: string;
    liked: boolean;
}

export interface ICollection {
    id: string;
    collection_name: string;
    companies: ICompany[];
    total: number;
}

export interface ICompanyBatchResponse {
    companies: ICompany[];
}

export interface IStatus {
    id: string;
    status: string;
    count: number;
    total: number;
    progress: number;
    collection: string;
    action: string;

}

export interface IStatusMetadata {
    statuses: IStatus[];
    inProgress: boolean;
}

const BASE_URL = 'http://localhost:8000';

export async function getCompanies(offset?: number, limit?: number): Promise<ICompanyBatchResponse> {
    try {
        const response = await axios.get(`${BASE_URL}/companies`, {
            params: {
                offset,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export async function getCollectionsById(id: string, offset?: number, limit?: number): Promise<ICollection> {
    try {
        const response = await axios.get(`${BASE_URL}/collections/${id}`, {
            params: {
                offset,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export async function getCollectionsMetadata(): Promise<ICollection[]> {
    try {
        const response = await axios.get(`${BASE_URL}/collections`);
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

// Add company to specified collection
export async function addToCollection(name: string, companies: ICompany[]): Promise<string> {
    try {
        // console.log(companies);
        const response = await axios.post(`${BASE_URL}/collections/${name}/like`, companies);
        console.log(response.data.id);
        return response.data.id;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

// Add a new collection
export async function addCollection(name: string): Promise<string> {
    try {
        // console.log(companies);
        const response = await axios.post(`${BASE_URL}/collections/${name}/add`);
        console.log(response.data.message);
        return response.data.message;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

// Remove from specified collection
export async function removeFromCollection(name: string, companies: ICompany[]): Promise<string> {
    try {
        // console.log(companies);
        const response = await axios.delete(`${BASE_URL}/collections/${name}/dislike`, { data: companies });
        console.log(response.data.id);
        return response.data.id;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

// Get status of all add and delete operations
export async function getStatus(): Promise<IStatusMetadata> {
    try {
        console.log('Here');
        const response = await axios.get(`${BASE_URL}/collections/id/status`);
        var data = response.data;
        data.inProgress = false;
        for (var row of data.statuses) {
            // Convert processed and total to percentage
            row.progress = String(Math.round((row.count / row.total) * 100)) + "%";
            // User friendly status of operation
            if (row.status == 'done') {
                row.status = "Completed"
            } else if (row.status == 'in_progress') {
                row.status = "In Progress"
                data.inProgress = true;
            }
            // User friendly status of action
            if (row.action == 'add') {
                row.action = "Add"
            } else if (row.action == 'remove') {
                row.action = "Remove"
            }
        }

        console.log(data);
        return data;
    } catch (error) {
        console.error('Error getting status', error);
        throw error;
    }
}