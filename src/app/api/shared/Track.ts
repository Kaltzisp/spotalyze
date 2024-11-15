import { JSDate } from "./JSDate";
import { getReleaseDateFromGenius } from "../playlists/get-info/genius";
import { getReleaseDateFromIsrc } from "../playlists/get-info/musicbrainz";

export interface SpotifyPlaylistItem {
    added_at: "string";
    added_by: {
        id: "string";
    };
    track: {
        id: string;
        album: {
            release_date: string;
            images: {
                url: string;
            }[];
        };
        artists: {
            name: string;
        }[];
        name: string;
        duration_ms: number;
        external_ids: {
            isrc: string;
        };
        popularity: number;
    };
}

export interface Scores {
    [userId: string]: {
        rank: number;
        note: string;
    };
}

export class Track {
    public readonly id: string;
    public readonly name: string;
    public readonly artists: string;
    public readonly duration: number;
    public readonly albumImageUrl: string;
    public readonly dateAdded: JSDate;
    public readonly addedBy: string;
    public readonly isrc: string;
    public dateReleased: JSDate;
    public scores?: Scores;

    public constructor(item: SpotifyPlaylistItem) {
        this.id = item.track.id;
        this.name = item.track.name;
        this.artists = item.track.artists.map((artist) => artist.name).join("; ");
        this.duration = item.track.duration_ms;
        this.albumImageUrl = item.track.album.images[0].url;
        this.dateAdded = new JSDate(item.added_at);
        this.addedBy = item.added_by.id;
        this.isrc = item.track.external_ids.isrc;
        this.dateReleased = new JSDate(item.track.album.release_date);
    }

    public get scoreTotal(): number {
        if (typeof this.scores === "undefined") {
            throw new Error("Track not scored.");
        }
        return Object.values(this.scores).reduce((acc, score) => acc + score.rank, 0);
    }

    public get scoreString(): string {
        if (typeof this.scores === "undefined") {
            throw new Error("Track not scored.");
        }
        return Object.values(this.scores).sort((a, b) => a.rank - b.rank).map((score) => score.rank.toString().padStart(3, "0")).join("");
    }

    public get scoreVariance(): number {
        if (typeof this.scores === "undefined") {
            throw new Error("Track not scored.");
        }
        const ranks = Object.values(this.scores).map((score) => score.rank);
        const mean = ranks.reduce((acc, rank) => acc + rank, 0) / ranks.length;
        return ranks.reduce((acc, rank) => acc + (rank - mean) ** 2, 0) / ranks.length;
    }

    public get scoreNoOutlier(): number {
        if (typeof this.scores === "undefined") {
            throw new Error("Track not scored.");
        }
        const ranks = Object.values(this.scores).map((score) => score.rank);
        const mean = ranks.reduce((acc, rank) => acc + rank, 0) / ranks.length;
        const scores = ranks.map((rank) => ({
            rank,
            variance: Math.abs(rank - mean)
        })).sort((a, b) => a.variance - b.variance);
        scores.pop();
        return scores.reduce((acc, score) => acc + score.rank, 0);
    }

    public async updateReleaseDate(): Promise<Track> {
        const musicbrainzDate = await getReleaseDateFromIsrc(this.isrc).catch(() => null);
        const geniusDate = await getReleaseDateFromGenius(this.name, this.artists).catch(() => null);
        const releaseDates = [this.dateReleased];
        if (musicbrainzDate) {
            releaseDates.push(musicbrainzDate);
        }
        if (geniusDate) {
            releaseDates.push(geniusDate);
        }
        this.dateReleased = releaseDates.sort((a, b) => a.getTime() - b.getTime())[0];
        return this;
    }

    public toCsvRow(): string {
        return `${this.id},"${this.artists}","${this.name}",${this.dateReleased.toExcelDate()},${this.dateAdded.toExcelDate()},${this.addedBy}`;
    }
}
