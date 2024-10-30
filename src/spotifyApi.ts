import { getTrackInfo } from "./geniusApi";

interface SpotifyTrack {
    track: {
        name: string;
        artists: {
            name: string;
        }[];
    };
}

interface PlaylistResponse {
    items: SpotifyTrack[];
    offset: number;
    total: number;
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

async function getFullPlaylist(url: string): Promise<SpotifyTrack[]> {
    const token = await getSpotifyToken();
    const playlistId = url.split("/").pop()?.split("?").shift();
    let allTracksConsumed = false;
    let currentOffset = 0;
    const tracks: SpotifyTrack[] = [];
    while (!allTracksConsumed) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${currentOffset}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const playlistInfo = await response.json() as PlaylistResponse;
        playlistInfo.items.forEach(item => tracks.push(item));
        if (playlistInfo.offset + 100 >= playlistInfo.total) {
            allTracksConsumed = true;
        } else {
            currentOffset += 100;
        }
    }
    return tracks;
}

export async function getReleaseDates(url: string): Promise<void> {
    const spotifyTracks = await getFullPlaylist(url);
    const trackPromises = spotifyTracks.map(async track => getTrackInfo(track.track.name, track.track.artists[0].name));
    const tracks = await Promise.all(trackPromises);
    tracks.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
    tracks.forEach((track) => {
        console.log(`${track.query} : ${track.name} : ${track.artists} : ${track.releaseDate}`);
    });
}

export async function playlistToCSV(url: string): Promise<void> {
    const tracks = await getFullPlaylist(url);
    const csvData = tracks.map(track => `${track.track.name}\t${track.track.artists.map(artist => artist.name).join("; ")}`).join("\n");
    console.log(csvData);
}
