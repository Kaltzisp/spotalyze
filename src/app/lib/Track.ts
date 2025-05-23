import { JSDate } from "./JSDate";
import { getReleaseDateFromGenius } from "../api/playlists/get-info/genius";
import { getReleaseDateFromIsrc } from "../api/playlists/get-info/musicbrainz";

export interface SpotifyPlaylistItem {
    added_at: string;
    added_by: {
        id: string;
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

export interface StoredTrack {
    id: string;
    name: string;
    artists: string;
    duration: number;
    albumImageUrl: string;
    dateAdded: string;
    addedBy: string;
    isrc: string;
    dateReleased: string;
    scores: Scores;
}

export class Track {
    public addedBy: string;
    public readonly albumImageUrl: string;
    public readonly artists: string;
    public readonly dateAdded: JSDate;
    public dateReleased: JSDate;
    public readonly duration: number;
    public readonly id: string;
    public readonly isrc: string;
    public readonly name: string;
    public scores?: Scores;

    public constructor(item: SpotifyPlaylistItem | StoredTrack) {
        if (Track.isSpotifyPlaylistItem(item)) {
            this.addedBy = item.added_by.id;
            this.albumImageUrl = item.track.album.images[0].url;
            this.artists = item.track.artists.map((artist) => artist.name).join("; ");
            this.dateAdded = new JSDate(item.added_at);
            this.dateReleased = new JSDate(item.track.album.release_date);
            this.duration = item.track.duration_ms;
            this.id = item.track.id;
            this.isrc = item.track.external_ids.isrc;
            this.name = item.track.name;
        } else {
            this.addedBy = item.addedBy;
            this.albumImageUrl = item.albumImageUrl;
            this.artists = item.artists;
            this.dateAdded = new JSDate(item.dateAdded);
            this.dateReleased = new JSDate(item.dateReleased);
            this.duration = item.duration;
            this.id = item.id;
            this.isrc = item.isrc;
            this.name = item.name;
            this.scores = item.scores;
        }
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

    private static isSpotifyPlaylistItem(item: SpotifyPlaylistItem | StoredTrack): item is SpotifyPlaylistItem {
        if ("track" in item) {
            return true;
        }
        return false;
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

    public play(token: string): void {
        fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uris: [`spotify:track:${this.id}`],
                position_ms: 0
            })
        }).catch((error: unknown) => console.error(error));
    }
}
