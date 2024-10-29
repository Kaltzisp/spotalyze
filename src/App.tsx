import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "src/Components/Menu";
import React from "react";

import AddBiometric from "./Pages/AddBiometric";
import AddCalories from "./Pages/AddCalories";
import AddExercise from "./Pages/AddExercise";
import ShowGraphs from "./Pages/ShowGraphs";

function App(): React.JSX.Element {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route element={<ShowGraphs />} path="/" />
                    <Route element={<AddBiometric />} path="/add-biometric" />
                    <Route element={<AddCalories />} path="/add-calories" />
                    <Route element={<AddExercise />} path="/add-exercise" />
                </Routes>
            </main>
            <Menu />
        </BrowserRouter>
    );
}

export default App;
