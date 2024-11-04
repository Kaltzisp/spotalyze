import { type SpotifyPlaylistItem, Track } from "./Track";

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
