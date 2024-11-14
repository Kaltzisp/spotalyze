"use client";
import React, { useEffect, useState } from "react";
import type { RankedTrack } from "@/app/api/playlists/submit-results/route";
import { useRouter } from "next/navigation";

export interface TextFile {
    name: string;
    content: string;
}


export default function Spotalyze(): React.JSX.Element {
    const router = useRouter();
    const [authButtonClass, setAuthButtonClass] = useState("color-norm");
    const [textInput, setTextInput] = useState("");
    const [showDropbox, setShowDropbox] = useState(false);
    const [files, setFiles] = useState<TextFile[]>([]);

    useEffect(() => { setAuthButtonClass(document.cookie.startsWith("spotify_token=") ? "color-auth" : "color-unauth") }, []);
    useEffect(() => { setTextInput(localStorage.getItem("textInput") ?? "") }, []);
    useEffect(() => { localStorage.setItem("textInput", textInput) }, [textInput]);

    function handleFileDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        for (const file of event.dataTransfer.files) {
            const reader = new FileReader();
            reader.onload = (): void => {
                setFiles((previousFiles) => [...previousFiles, {
                    name: file.name.split(".")[0],
                    content: reader.result as string
                }]);
            };
            reader.readAsText(file);
        }
    }

    async function handleFileSumbission(): Promise<void> {
        setShowDropbox(false);
        const response = await fetch("/api/playlists/submit-results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(files)
        });
        const tracks = await response.json() as RankedTrack[];
        localStorage.setItem("tracks", JSON.stringify(tracks));
        router.push("/soty/slideshow");
    }

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
                    <button className="nice-button color-invert" type="button" onClick={() => {
                        fetch(`/api/playlists/get-info?url=${textInput}`).catch((error: unknown) => console.error(error));
                    }}>{"Get Info"}
                    </button>
                </span>
                {showDropbox ? <div className="rounded-full px-4 flex justify-center items-center drag-drop-area border h-20"
                    onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleFileDrop(event)}>
                    {files.length > 0 ? <ul className="columns-4 font-mono flex">
                        {files.map((file) => <li className="text-center m-3" key={file.name}>{file.name}</li>)}
                    </ul> : null}
                </div> : null}
                <button className="nice-button color-invert" type="button" onClick={() => {
                    if (showDropbox) {
                        handleFileSumbission().catch((error: unknown) => console.error(error));
                        setShowDropbox(false);
                    } else {
                        setShowDropbox(true);
                    }
                }}>{showDropbox ? "Submit Files" : "Upload Files"}
                </button>
            </main>
        </div>
    );
}
