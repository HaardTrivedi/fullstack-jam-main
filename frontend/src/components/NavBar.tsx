import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";

import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export const Navbar = () => {
    return (
        <ThemeProvider theme={darkTheme} >
            < CssBaseline />
            <div className="font-bold text-xl border-b p-2 mb-4 text-left" >
                <Title to="/">Harmonic Jam </Title>
            </div>
            <Nav>
                <NavMenu>
                    <NavLink to="/">
                        Home
                    </NavLink>
                    <NavLink to="/status">
                        Status
                    </NavLink>
                    <NavLink to="/add-collection">
                        Add Collection
                    </NavLink>
                </NavMenu>
            </Nav>
        </ThemeProvider>
    );
};

const Nav = styled.nav`
    height: 85px;
    display: flex;
    justify-content: space-between;
    padding: 0.2rem calc((100vw - 1000px) / 3.5);
    z-index: 12;
`;

const NavLink = styled(Link)`
    color: #ffffff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    &.active {
        color: #646cff;
    }
`;

const Title = styled(Link)`
    color: #ffffff;
    display: flex;
    align-items: center;
    text-decoration: none;
    height: 100%;
    cursor: pointer;
    &.active {
        color: #ffffff;
    }
`;

const Bars = styled.div`
    display: none;
    color: #ffffff;
    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: -24px;
    /* Second Nav */
    /* margin-right: 24px; */
    /* Third Nav */
    /* width: 100vw;
white-space: nowrap; */
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export default Navbar;