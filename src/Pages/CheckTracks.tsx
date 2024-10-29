import React, { useState } from "react";
import { getPlaylist } from "src/services/spotifyApi";

function CheckTracks(): React.JSX.Element {
    const [playlistUrl, setPlaylistUrl] = useState("");
    return (
        <div>
            <input name="playlistUrl" onChange={(e): void => setPlaylistUrl(e.target.value)} placeholder="Spotify Playlist URL" type="text" value={playlistUrl} />
            <button onClick={(): void => {
                getPlaylist(playlistUrl).catch(e => console.error(e));
            }} type="button">{"Check release dates"}
            </button>
        </div>
    );

}

export default CheckTracks;
