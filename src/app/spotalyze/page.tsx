"use client";
import React, { useEffect, useState } from "react";

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
                    <input className="nice-button color-norm" placeholder="Spotify Track URL" type="text" value={textInput} onChange={(event) => setTextInput(event.target.value)} />
                </span>
                <p className="text-center">{"Spotalyze. © SOTY 2024"}</p>
                <span className="flex justify-center">
                    <button className="nice-button color-invert mr-5" type="button" onClick={() => {
                        fetch(`/api/playlists/get-csv?url=${textInput}`).catch((error: unknown) => console.error(error));
                    }}>{"To CSV"}
                    </button>
                    <button className="nice-button color-invert mr-5" type="button" onClick={() => {
                        fetch(`/api/playlists/shuffle?url=${textInput}`).catch((error: unknown) => console.error(error));
                    }}>{"Shuffle"}
                    </button>
                    <button className="nice-button color-invert mr-5" type="button" onClick={() => {
                        fetch(`/api/playlists/get-info?url=${textInput}`).catch((error: unknown) => console.error(error));
                    }}>{"Get Info"}
                    </button>
                </span>
            </main>
        </div >
    );
}
