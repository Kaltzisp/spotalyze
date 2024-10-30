import type { SpotifyTrack } from "../APIs/spotify";
import { getReleaseDateFromGenius } from "../APIs/genius";
import { getReleaseDateFromIsrc } from "../APIs/musicbrainz";

export class Track {

    public readonly id: string;
    public readonly name: string;
    public readonly artists: string;
    public readonly isrc: string;
    public releaseDate: Date;

    public constructor(spotifyTrack: SpotifyTrack) {
        this.id = spotifyTrack.id;
        this.name = spotifyTrack.name;
        this.artists = spotifyTrack.artists.map(artist => artist.name).join("; ");
        this.isrc = spotifyTrack.external_ids.isrc;
        this.releaseDate = new Date(spotifyTrack.album.release_date);
    }

    public async getEarliestReleaseDate(): Promise<Track> {
        const musicbrainzDate = await getReleaseDateFromIsrc(this.isrc).catch(() => null);
        const geniusDate = await getReleaseDateFromGenius(this.name, this.artists).catch(() => null);
        const releaseDates = [this.releaseDate];
        if (musicbrainzDate) {
            releaseDates.push(musicbrainzDate);
        }
        if (geniusDate) {
            releaseDates.push(geniusDate);
        }
        this.releaseDate = releaseDates.sort((a, b) => a.getTime() - b.getTime()).shift()!;
        return this;
    }

}
