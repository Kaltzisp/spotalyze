export interface SpotifyTrack {
    id: string;
    album: {
        release_date: string;
    };
    artists: {
        name: string;
    }[];
    name: string;
    external_ids: {
        isrc: string;
    };
}

export class Track {
    public readonly id: string;
    public readonly name: string;
    public readonly artists: string;
    public readonly isrc: string;
    public releaseDate: Date;

    public constructor(spotifyTrack: SpotifyTrack) {
        this.id = spotifyTrack.id;
        this.name = spotifyTrack.name;
        this.artists = spotifyTrack.artists.map((artist) => artist.name).join("; ");
        this.isrc = spotifyTrack.external_ids.isrc;
        this.releaseDate = new Date(spotifyTrack.album.release_date);
    }
}
