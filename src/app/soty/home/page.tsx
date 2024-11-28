"use client";
import React, { useEffect, useState } from "react";
import Dropzone from "./Components/Dropzone";
import UtilButtons from "./Components/UtilButtons";


export default function Spotalyze(): React.JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [textInput, setTextInput] = useState("");

    useEffect(() => { setIsAuthenticated(document.cookie.split("; ").some((cookie) => cookie.startsWith("spotify_token="))) }, []);
    useEffect(() => { setTextInput(localStorage.getItem("textInput") ?? "") }, []);
    useEffect(() => { localStorage.setItem("textInput", textInput) }, [textInput]);

    return (
        <div className="align-middle justify-items-center p-8">
            <main className="flex flex-col gap-8">
                <span className="flex justify-center gap-5">
                    <button className={`nice-button ${isAuthenticated ? "color-auth" : "color-unauth"}`} type="button" onClick={() => {
                        window.location.href = "/api/auth/login";
                    }}>{"Authenticate"}
                    </button>
                    <input className="nice-button color-norm" placeholder="Playlist URL / Track IDs" type="text" value={textInput} onChange={(event) => setTextInput(event.target.value)} />
                </span>
                <p className="text-center">{"Spotalyze. © SOTY 2024"}</p>
                <UtilButtons textInput={textInput} />
                <Dropzone textInput={textInput} />
            </main>
        </div>
    );
}
