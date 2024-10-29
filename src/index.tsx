import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

import "src/styles/global.css";
import "src/styles/form.css";
import "src/styles/menu.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
