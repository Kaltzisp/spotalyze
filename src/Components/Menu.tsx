import { Link } from "react-router-dom";
import React from "react";

function Menu(): React.JSX.Element {
    return (
        <nav id="menu">
            <Link to="/">{"Graphs"}</Link>
            <Link to="/add-biometric">{"+ Metric"}</Link>
            <Link to="/add-calories">{"+ Calories"}</Link>
            <Link to="/add-exercise">{"+ Exercise"}</Link>
        </nav>
    );
}

export default Menu;
