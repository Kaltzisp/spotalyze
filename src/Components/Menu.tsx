import { Link } from "react-router-dom";
import React from "react";

function Menu(): React.JSX.Element {
    return (
        <nav id="menu">
            <Link to="/check-tracks">{"Check Tracks"}</Link>
            <Link to="/get-tracks">{"Create CSV"}</Link>
        </nav>
    );
}

export default Menu;
