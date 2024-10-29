import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";

import CheckTracks from "./Pages/CheckTracks";
import Menu from "./Components/Menu";

function App(): React.JSX.Element {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route element={<Navigate replace to="/check-tracks" />} path="/" />
                    <Route element={<CheckTracks />} path="check-tracks" />
                </Routes>
            </main>
            <Menu />
        </BrowserRouter>
    );
}

export default App;
