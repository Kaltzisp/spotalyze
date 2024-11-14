import { type SpotifyPlaylistItem, Track } from "./Track";
import { readFileSync } from "fs";

interface CreatePlaylistResponse {
    id: string;
    external_urls: {
        spotify: string;
    };
}

interface SpotifyPlaylistResponse {
    items: SpotifyPlaylistItem[];
    offset: number;
    total: number;
}

export class Playlist {
    public tracks: Track[] = [];
    private readonly id: string;

    public constructor(playlistUrl: string) {
        this.id = playlistUrl.split("/").at(-1)?.split("?")[0] ?? playlistUrl;
    }

    public static async create(trackURIs: string[], name: string, description: string, imagePath?: string): Promise<string> {
        const response = await fetch("https://api.spotify.com/v1/users/omgodmez/playlists", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.SPOTIFY_USER_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                description,
                public: true
            })
        });
        const data = await response.json() as CreatePlaylistResponse;
        while (trackURIs.length > 0) {
            // eslint-disable-next-line no-await-in-loop
            await fetch(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, {
                method: "POST",
                headers: { Authorization: `Bearer ${process.env.SPOTIFY_USER_TOKEN}` },
                body: JSON.stringify({ uris: trackURIs.splice(0, 100) })
            });
        }
        if (typeof imagePath === "string") {
            await fetch(`https://api.spotify.com/v1/playlists/${data.id}/images`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${process.env.SPOTIFY_USER_TOKEN}`,
                    "Content-Type": "image/jpeg"
                },
                body: readFileSync(imagePath).toString("base64")
            });
        }
        return data.external_urls.spotify;
    }

    public static async play(playlistId: string): Promise<void> {
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${process.env.SPOTIFY_USER_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                context_uri: `spotify:playlist:${playlistId}`
            })
        });
    }

    public async getTracks(token: string): Promise<void> {
        let allTracksConsumed = false;
        let currentOffset = 0;
        const spotifyTracks: SpotifyPlaylistItem[] = [];
        while (!allTracksConsumed) {
            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(`https://api.spotify.com/v1/playlists/${this.id}/tracks?offset=${currentOffset}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // eslint-disable-next-line no-await-in-loop
            const playlistInfo = await response.json() as SpotifyPlaylistResponse;
            playlistInfo.items.forEach((item) => spotifyTracks.push(item));
            if (playlistInfo.offset + playlistInfo.items.length >= playlistInfo.total) {
                allTracksConsumed = true;
            } else {
                currentOffset += playlistInfo.items.length;
            }
        }
        this.tracks = spotifyTracks.map((spotifyTrack) => new Track(spotifyTrack));
    }
}
