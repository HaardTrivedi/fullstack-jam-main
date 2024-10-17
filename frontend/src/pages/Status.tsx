import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import CompanyTable from "../components/CompanyTable";
import { getCollectionsById, getCollectionsMetadata, getStatus, ICompany, IStatus } from "../utils/jam-api";
import useApi from "../utils/useApi";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const Status = () => {
    const [response, setResponse] = useState<IStatus[]>([]);
    const [total, setTotal] = useState<number>(1);
    const [offset, setOffset] = useState<number>(0);
    const [pageSize, setPageSize] = useState(25);
    const [progress, setProgress] = useState<boolean>(true);
    const [time, setTime] = useState(new Date());
    // Refresh page every 2500 ms to get latest status
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
            console.log(progress);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getStatus().then(
            (newResponse) => {
                console.log(newResponse);
                setResponse(newResponse.statuses);
                setTotal(newResponse.statuses.length);
                setProgress(newResponse.inProgress);
            }
        )
    }, [time, pageSize, offset]);

    return (
        <ThemeProvider theme={darkTheme} >
            <CssBaseline />
            {progress ? <LinearProgress color="secondary"/> : <></>}
            <DataGrid
                rows={response}
                rowHeight={30}
                columns={[
                    { field: "id", headerName: "ID", width: 100 },
                    { field: "collection", headerName: "Collection", width: 200 },
                    { field: "action", headerName: "Action", width: 100 },
                    { field: "status", headerName: "Status", width: 200 },
                    { field: "progress", headerName: "Progress", width: 200 }
                ]}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'status', sort: 'desc' }],
                    },
                    pagination: {
                        paginationModel: { page: 0, pageSize: 25 },
                    },
                }}
                rowCount={total}
                pagination
                paginationMode="server"
                onPaginationModelChange={(newMeta) => {
                    setPageSize(newMeta.pageSize);
                    setOffset(newMeta.page * newMeta.pageSize);
                }}
            />
        </ThemeProvider>
    )
}

export default Status;