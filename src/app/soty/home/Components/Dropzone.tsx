import React, { useState } from "react";
import type { Playlist } from "@/app/lib/Playlist";
import { useRouter } from "next/navigation";

export interface TextFile {
    name: string;
    content: string;
}

interface DropzoneProps {
    readonly textInput: string;
}

export default function Dropzone(props: DropzoneProps): React.JSX.Element {
    const router = useRouter();
    const [showDropbox, setShowDropbox] = useState(false);
    const [files, setFiles] = useState<TextFile[]>([]);

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
        const response = await fetch(`/api/playlists/submit-results?url=${props.textInput}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(files)
        });
        const playlist = await response.json() as Playlist;
        localStorage.setItem("Playlist", JSON.stringify(playlist));
        router.push("/soty/slideshow");
    }

    return (
        <div className="flex flex-col gap-5">
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
        </div>
    );
}
