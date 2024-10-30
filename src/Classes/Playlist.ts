import type { Track } from "./Track.js";
import { getSpotifyPlaylist } from "../APIs/spotify.js";
import { writeFileSync } from "fs";

export class Playlist {

    private readonly url: string;
    private tracks: Track[] = [];

    public constructor(playlistUrl: string) {
        this.url = playlistUrl;
    }

    public async getTracks(): Promise<void> {
        this.tracks = await getSpotifyPlaylist(this.url);
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

}
