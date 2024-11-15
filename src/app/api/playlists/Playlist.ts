import { type SpotifyPlaylistItem, Track } from "./Track";
import { readFileSync } from "fs";

interface SpotifyPlaylistResponse {
    items: SpotifyPlaylistItem[];
    offset: number;
    total: number;
}

export class Playlist {
    public id: string;
    public tracks: Track[];

    private constructor(id: string, tracks: Track[]) {
        this.id = id;
        this.tracks = tracks;
    }

    public get trackURIs(): string[] {
        return this.tracks.map((track) => `spotify:track:${track.id}`);
    }

    public static async fromUrl(url: string, token: string): Promise<Playlist> {
        const playlistId = url.split("/").at(-1)?.split("?")[0];
        if (typeof playlistId === "undefined") {
            throw new Error("Invalid URL.");
        }
        const tracks = await Playlist.getTracks(playlistId, token);
        return new Playlist(playlistId, tracks);
    }

    public static async fromTracks(playlistName: string, trackURIs: string[], playlistImage: string | null, token: string): Promise<Playlist> {
        const response = await fetch("https://api.spotify.com/v1/users/omgodmez/playlists", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: playlistName,
                description: "None",
                public: true
            })
        });
        const data = await response.json() as { id: string };
        while (trackURIs.length > 0) {
            // eslint-disable-next-line no-await-in-loop
            await fetch(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ uris: trackURIs.splice(0, 100) })
            });
        }
        if (typeof playlistImage === "string") {
            await fetch(`https://api.spotify.com/v1/playlists/${data.id}/images`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${process.env.SPOTIFY_USER_TOKEN}`,
                    "Content-Type": "image/jpeg"
                },
                body: readFileSync(playlistImage).toString("base64")
            });
        }
        const tracks = await Playlist.getTracks(data.id, token);
        return new Playlist(data.id, tracks);
    }

    public static async getTracks(playlistId: string, token: string): Promise<Track[]> {
        const tracks: Track[] = [];
        let allTracksConsumed = false;
        let currentOffset = 0;
        while (!allTracksConsumed) {
            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${currentOffset}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // eslint-disable-next-line no-await-in-loop
            const playlistInfo = await response.json() as SpotifyPlaylistResponse;
            playlistInfo.items.forEach((item) => tracks.push(new Track(item)));
            if (playlistInfo.offset + playlistInfo.items.length >= playlistInfo.total) {
                allTracksConsumed = true;
            } else {
                currentOffset += playlistInfo.items.length;
            }
        }
        return tracks;
    }
}
