import React, { useState } from "react";
import { getReleaseDates, playlistToCSV } from "src/services/spotifyApi";

function CheckTracks(): React.JSX.Element {
    const [playlistUrl, setPlaylistUrl] = useState("");

    return (
        <div>
            <input name="playlistUrl" onChange={(e): void => setPlaylistUrl(e.target.value)} placeholder="Spotify Playlist URL" type="text" value={playlistUrl} />
            <button onClick={(): void => {
                getReleaseDates(playlistUrl).catch(e => console.error(e));
            }} type="button">{"Check release dates"}
            </button>
            <button onClick={(): void => {
                playlistToCSV(playlistUrl).catch(e => console.error(e));
            }} type="button">{"Playlist to CSV"}
            </button>
        </div>
    );

}

export default CheckTracks;
