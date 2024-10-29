import { type Track, getTrackInfo } from "./geniusApi";

interface SpotifyTrack {
    track: {
        name: string;
        artists: {
            name: string;
        }[];
    };
}

interface PlaylistResponse {
    tracks: {
        items: SpotifyTrack[];
        offset: number;
        total: number;
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

async function getFullPlaylist(url: string): Promise<Track[]> {
    const token = await getSpotifyToken();
    const playlistId = url.split("/").pop();
    let allTracksConsumed = false;
    let currentOffset = 0;
    const trackPromises: Promise<Track>[] = [];
    while (!allTracksConsumed) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}?offset=${currentOffset}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const playlistInfo = await response.json() as PlaylistResponse;
        playlistInfo.tracks.items.forEach(item => trackPromises.push(getTrackInfo(item.track.name, item.track.artists[0].name)));
        if (playlistInfo.tracks.offset + 100 >= playlistInfo.tracks.total) {
            allTracksConsumed = true;
        } else {
            currentOffset += 100;
        }
    }
    const tracks = await Promise.all(trackPromises);
    return tracks;
}

export async function getPlaylist(url: string): Promise<void> {
    const tracks = await getFullPlaylist(url);
    tracks.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
    tracks.forEach((track) => {
        console.log(`${track.query} : ${track.name} : ${track.artists} : ${track.releaseDate}`);
    });
}
