import React from "react";

interface UtilButtonsProps {
    readonly textInput: string;
}

export default function UtilButtons(props: UtilButtonsProps): React.JSX.Element {
    return (
        <span className="flex justify-center">

            <button className="nice-button color-invert mr-5" type="button" onClick={() => {
                fetch(`/api/playlists/get-csv?url=${props.textInput}`).catch((error: unknown) => console.error(error));
            }}>{"To CSV"}
            </button>

            <button className="nice-button color-invert mr-5" type="button" onClick={() => {
                fetch("/api/playlists/create", {
                    method: "POST",
                    body: JSON.stringify({
                        trackURIs: props.textInput.split(",").map((uri) => uri.trim()),
                        shuffle: false
                    })
                }).catch((error: unknown) => console.error(error));
            }}>{"From Tracks"}
            </button>

            <button className="nice-button color-invert mr-5" type="button" onClick={() => {
                fetch("/api/playlists/create", {
                    method: "POST",
                    body: JSON.stringify({
                        sourcePlaylistUrl: props.textInput,
                        shuffle: true
                    })
                }).catch((error: unknown) => console.error(error));
            }}>{"Shuffle"}
            </button>

            <button className="nice-button color-invert" type="button" onClick={() => {
                fetch(`/api/playlists/get-info?url=${props.textInput}`).catch((error: unknown) => console.error(error));
            }}>{"Get Info"}
            </button>

        </span>
    );
}
