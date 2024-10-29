import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { getPlaylist } from "./services/spotifyApi";
import { getTrackInfo } from "./services/geniusApi";

function App(): React.JSX.Element {
    const [playlistUrl, setPlaylistUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    function handleButtonClick(): void {
        getPlaylist(playlistUrl).catch(e => console.error(e));
    }

    function handleButtonClicke(): void {
        getTrackInfo(searchQuery, "").catch(e => console.error(e));
    }

    // function authenticateGenius(): void {
    //     const clientId = process.env.REACT_APP_GENIUS_CLIENT_ID;
    //     const url = `"https://api.genius.com/oauth/authorize?client_id=${clientId}&redirect_uri=localhost:3000&scope=me&state=true&response_type=code`;
    //     console.log(url);
    //     //
    // }

    return (
        <BrowserRouter>
            <main>
                <input name="playlistUrl" onChange={(e): void => setPlaylistUrl(e.target.value)} placeholder="Enter playlist url here" type="text" value={playlistUrl} />
                <button onClick={handleButtonClick} type="button">{"Get playlist info"}</button>
                <input name="query" onChange={(e): void => setSearchQuery(e.target.value)} placeholder="Enter search query here" type="text" value={searchQuery} />
                <button onClick={handleButtonClicke} type="button">{"Search"}</button>
            </main>
        </BrowserRouter>
    );
}

export default App;
