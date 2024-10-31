import { createPlaylist, getSpotifyPlaylist } from "../APIs/spotify.js";
import type { Track } from "./Track.js";
import { writeFileSync } from "fs";

export class Playlist {

    private readonly id: string;
    private tracks: Track[] = [];

    public constructor(playlistId: string) {
        this.id = playlistId;
    }

    public async getTracks(): Promise<void> {
        this.tracks = await getSpotifyPlaylist(this.id);
    }

    public async printWithReleaseDates(): Promise<void> {
        this.tracks = await Promise.all(this.tracks.map(async track => track.getEarliestReleaseDate()));
        this.tracks.sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime());
        const output = this.tracks.map(track => `${track.name} : ${track.artists} : ${track.releaseDate.toISOString().split("T").shift()}`).join("\n");
        console.log(output);
    }

    public printAsCSV(): void {
        const output = this.tracks.map(track => `${track.name}\t${track.artists}`).join("\n");
        console.log(output);
    }

    public saveTrackIds(fileName: string): void {
        const output = JSON.stringify(this.tracks.map(track => track.id));
        writeFileSync(`./data/${fileName}.json`, output, "utf8")
    }

    public async createShuffled(playlistName: string, token: string): Promise<void> {
        const trackURIs = this.tracks.map(track => `spotify:track:${track.id}`);
        for (let i = trackURIs.length - 1; i >= 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [trackURIs[i], trackURIs[j]] = [trackURIs[j], trackURIs[i]];
        }
        const playlistUrl = await createPlaylist(playlistName, trackURIs, token);
        console.log(`New playlist created at: ${playlistUrl}`);
    }

}
