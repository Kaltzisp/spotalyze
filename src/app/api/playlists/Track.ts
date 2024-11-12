import { JSDate } from "./JSDate";
import { getReleaseDateFromGenius } from "./get-info/genius";
import { getReleaseDateFromIsrc } from "./get-info/musicbrainz";

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

export class Track {
    public readonly id: string;
    public readonly artists: string;
    public readonly name: string;
    public readonly isrc: string;
    public dateReleased: JSDate;
    public readonly dateAdded: JSDate;
    public readonly addedBy: string;
    public readonly albumImageUrl: string;
    public readonly duration: number;
    public readonly spotifyPopularity: number;

    public constructor(item: SpotifyPlaylistItem) {
        this.id = item.track.id;
        this.artists = item.track.artists.map((artist) => artist.name).join("; ");
        this.name = item.track.name;
        this.isrc = item.track.external_ids.isrc;
        this.dateReleased = new JSDate(item.track.album.release_date);
        this.dateAdded = new JSDate(item.added_at);
        this.addedBy = item.added_by.id;
        this.albumImageUrl = item.track.album.images[0].url;
        this.duration = item.track.duration_ms;
        this.spotifyPopularity = item.track.popularity;
    }

    public async getEarliestReleaseDate(): Promise<Track> {
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
