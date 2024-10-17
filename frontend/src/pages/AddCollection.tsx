import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { Alert, Button, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import CompanyTable from "../components/CompanyTable";
import { addCollection, addToCollection, getCollectionsMetadata } from "../utils/jam-api";
import useApi from "../utils/useApi";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const AddCollection = () => {
    const [collectionName, setCollectionName] = useState<string>("");
    const [msg, setMsg] = useState<string>("");

    const handleClick = async () => {
        const response = await addCollection(collectionName);
        setMsg(response);
    }

    return (
        <ThemeProvider theme={darkTheme} >
            <CssBaseline />
            < div className="mx-8" >

                < div className="flex" >
                    <TextField id="outlined-basic" label="Collection Name" style={{ marginInline: 10 }} variant="outlined" onChange={(name) => { setCollectionName(name.target.value) }} />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={collectionName.length == 0}
                        sx={{ mb: 1, marginX: 2, width: 100 }}
                        onClick={handleClick}
                    >
                        Add
                    </Button>
                </div>
                {
                    msg.includes('Success') ?
                        <Alert severity="success">
                            {msg}
                        </Alert>
                        : msg.includes('Error') ?
                            < Alert severity="error">
                                {msg}
                            </Alert> :
                            <></>
                }
            </div>
        </ThemeProvider >
    )
}

export default AddCollection;