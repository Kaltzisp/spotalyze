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

interface CreatePlaylistResponse {
    id: string;
    external_urls: {
        spotify: string;
    };
}

export async function getUserToken(authCode: string, redirectUri: string): Promise<string> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: `code=${authCode}&redirect_uri=${redirectUri}&grant_type=authorization_code`
    });
    const data = await response.json() as { access_token: string };
    return data.access_token;
}

async function getApiToken(): Promise<string> {
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

export async function getSpotifyPlaylist(playlistId: string): Promise<Track[]> {
    const token = await getApiToken();
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

export async function createPlaylist(playlistName: string, trackURIs: string[]): Promise<string> {
    const response = await fetch("https://api.spotify.com/v1/users/omgodmez/playlists", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.SPOTIFY_USER_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: playlistName,
            description: "None",
            public: true
        })
    });
    const data = await response.json() as CreatePlaylistResponse;
    while (trackURIs.length > 0) {
        await fetch(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.SPOTIFY_USER_TOKEN}` },
            body: JSON.stringify({ uris: trackURIs.splice(0, 100) })
        });
    }
    return data.external_urls.spotify
}
