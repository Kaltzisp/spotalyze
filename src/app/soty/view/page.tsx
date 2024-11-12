"use client";
import React, { useEffect, useState } from "react";

export interface TextFile {
    name: string;
    content: string;
}


export default function Spotalyze(): React.JSX.Element {
    const [authButtonClass, setAuthButtonClass] = useState("color-norm");
    const [textInput, setTextInput] = useState("");

    useEffect(() => { setAuthButtonClass(document.cookie.startsWith("spotify_token=") ? "color-auth" : "color-unauth") }, []);
    useEffect(() => { setTextInput(localStorage.getItem("textInput") ?? "") }, []);
    useEffect(() => { localStorage.setItem("textInput", textInput) }, [textInput]);

    return (
        <div className="align-middle justify-items-center p-8">
            <main className="flex flex-col gap-8">
                <span className="flex justify-center gap-5">
                    <button className={`nice-button ${authButtonClass}`} type="button" onClick={() => {
                        window.location.href = "/api/auth/login";
                    }}>{"Authenticate"}
                    </button>
                    <input className="nice-button color-norm" placeholder="Spotify URL" type="text" value={textInput} onChange={(event) => setTextInput(event.target.value)} />
                </span>
            </main>
        </div>
    );
}
