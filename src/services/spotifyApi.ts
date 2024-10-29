import { getTrackInfo } from "./geniusApi";

interface Track {
    track: {
        name: string;
        artists: {
            name: string;
        }[];
    };
}

interface PlaylistResponse {
    tracks: {
        items: Track[];
    };
}

export async function getSpotifyToken(): Promise<string> {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: "grant_type=client_credentials"
    });
    const data = await response.json() as { access_token: string };
    return data.access_token;
}

export async function getPlaylist(url: string): Promise<void> {
    const token = await getSpotifyToken();
    const response = await fetch(`https://api.spotify.com/v1/playlists/${url.split("/").pop()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const playlistInfo = await response.json() as PlaylistResponse;
    const tracks = await Promise.all(playlistInfo.tracks.items.map(async item => getTrackInfo(item.track.name, item.track.artists[0].name)));
    tracks.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
    tracks.forEach((track) => {
        console.log(`${track.query} : ${track.name} : ${track.artists} : ${track.releaseDate}`);
    });
}
