import "./App.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { getCollectionsMetadata } from "./utils/jam-api";
import useApi from "./utils/useApi";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Status from "./pages/Status";
import AddCollection from "./pages/AddCollection";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme} >
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/status" element={<Status />} />
          <Route path="/add-collection" element={<AddCollection />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
