"use client";
import React, { useEffect, useState } from "react";

interface PageProps {
    readonly searchParams: Promise<{ code?: string }>;
}

export default function Spotalyze(props: PageProps): React.JSX.Element {
    const [textInput, setTextInput] = useState("");

    useEffect(() => { setTextInput(localStorage.getItem("textInput") ?? "") }, []);
    useEffect(() => { localStorage.setItem("textInput", textInput) }, [textInput]);

    useEffect(() => {
        props.searchParams.then((params) => {
            if (typeof params.code === "string") {
                console.log("OK");
                document.cookie = `spotify_auth_token=${params.code}; path=/api/spotalyze; samesite=strict;`;
                history.replaceState(null, "", window.location.toString().split("?").shift());
            }
        }).catch((error: unknown) => console.error(error));
    }, []);

    return (
        <div className="align-middle justify-items-center p-8">
            <main className="flex flex-col gap-8">
                <span className="flex justify-center gap-5">
                    <button className="nice-button color-norm" type="button" onClick={() => {
                        window.location.href = "/api/spotalyze/authenticate";
                    }}>{"Authenticate"}
                    </button>
                    <input className="nice-button color-norm" placeholder="Spotify Track URL" type="text" value={textInput} onChange={(event) => setTextInput(event.target.value)} />
                </span>
                <p className="text-center">{"Spotalyze. © SOTY 2024"}</p>
                <span className="flex justify-center">
                    <button className="nice-button color-invert mr-5" type="button">{"Authenticate"}</button>
                    <button className="nice-button color-invert mr-5" type="button">{"Authenticate"}</button>
                    <button className="nice-button color-invert" type="button">{"Authenticate"}</button>
                </span>
            </main>
        </div>
    );
}
