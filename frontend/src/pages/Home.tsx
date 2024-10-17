import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import CompanyTable from "../components/CompanyTable";
import { getCollectionsMetadata } from "../utils/jam-api";
import useApi from "../utils/useApi";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const Home = () => {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
    const [selectedCollectionName, setSelectedCollectionName] = useState<string>();
    const { data: collectionResponse } = useApi(() => getCollectionsMetadata());

    useEffect(() => {
        setSelectedCollectionId(collectionResponse?.[0]?.id);
        setSelectedCollectionName(collectionResponse?.[0]?.collection_name);
    }, [collectionResponse]);
    return (
        <ThemeProvider theme={darkTheme} >
            <CssBaseline />
            < div className="mx-8" >

                < div className="flex" >
                    <div className="w-1/5" >
                        <p className=" font-bold border-b pb-2" > Collections </p>
                        < div className="flex flex-col gap-2" >
                            {collectionResponse?.map((collection) => {
                                return (
                                    <div
                                        className={`py-1 hover:cursor-pointer hover:bg-orange-300 ${selectedCollectionId === collection.id &&
                                            "bg-orange-500 font-bold"
                                            }`
                                        }
                                        onClick={() => {
                                            setSelectedCollectionId(collection.id);
                                            setSelectedCollectionName(collection.collection_name);
                                        }
                                        }
                                    >
                                        {collection.collection_name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    < div className="w-4/5 ml-4" >
                        {selectedCollectionId && selectedCollectionName && collectionResponse && (
                            <CompanyTable selectedCollectionId={selectedCollectionId} selectedCollectionName={selectedCollectionName} collectionResponse={collectionResponse} />
                        )}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Home;