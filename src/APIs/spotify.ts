import { Track } from "../Classes/Track.js";

export interface SpotifyTrack {
    id: string;
    album: {
        release_date: string;
    }
    artists: {
        name: string;
    }[];
    name: string;
    external_ids: {
        isrc: string;
    };
}

interface PlaylistResponse {
    items: {
        track: SpotifyTrack;
    }[];
    offset: number;
    total: number;
}

async function getSpotifyToken(): Promise<string> {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
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

export async function getSpotifyPlaylist(playlistUrl: string): Promise<Track[]> {
    const token = await getSpotifyToken();
    const playlistId = playlistUrl.split("/").pop()?.split("?").shift();
    let allTracksConsumed = false;
    let currentOffset = 0;
    const spotifyTracks: SpotifyTrack[] = [];
    while (!allTracksConsumed) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${currentOffset}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const playlistInfo = await response.json() as PlaylistResponse;
        playlistInfo.items.forEach(item => spotifyTracks.push(item.track));
        if (playlistInfo.offset + 100 >= playlistInfo.total) {
            allTracksConsumed = true;
        } else {
            currentOffset += 100;
        }
    }
    return spotifyTracks.map(spotifyTrack => new Track(spotifyTrack));
}
