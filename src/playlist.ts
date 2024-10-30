import { getReleaseDateFromGenius } from "./APIs/genius.js";
import { getReleaseDateFromIsrc } from "./APIs/musicbrainz.js";
import { getSpotifyPlaylist } from "./APIs/spotify.js";

interface Track {
    name: string;
    artists: string;
    isrc: string;
    releaseDate: Date;
}

async function getEarliestReleaseDate(track: Track): Promise<Date> {
    const musicbrainzDate = await getReleaseDateFromIsrc(track.isrc).catch(() => null);
    const geniusDate = await getReleaseDateFromGenius(track.name, track.artists).catch(() => null);
    const releaseDates = [track.releaseDate];
    if (musicbrainzDate) {
        releaseDates.push(musicbrainzDate);
    }
    if (geniusDate) {
        releaseDates.push(geniusDate);
    }
    return releaseDates.sort((a, b) => a.getTime() - b.getTime()).shift()!;
}

export async function getPlaylistWithDates(playlistUrl: string): Promise<void> {
    const spotifyTracks = await getSpotifyPlaylist(playlistUrl);
    const tracks = await Promise.all(spotifyTracks.map(async (spotifyTrack) => {
        const track: Track = {
            name: spotifyTrack.name,
            artists: spotifyTrack.artists.map(artist => artist.name).join("; "),
            isrc: spotifyTrack.external_ids.isrc,
            releaseDate: new Date(spotifyTrack.album.release_date)
        };
        track.releaseDate = await getEarliestReleaseDate(track);
        return track;
    }));
    tracks.sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime());
    tracks.forEach((track) => {
        console.log(`${track.name} : ${track.artists} : ${track.releaseDate.toISOString().split("T").shift()}`);
    });
}

// export async function playlistToCSV(url: string): Promise<void> {
//     const tracks = await getFullPlaylist(url);
//     const csvData = tracks.map(track => `${track.track.name}\t${track.track.artists.map(artist => artist.name).join("; ")}`).join("\n");
//     console.log(csvData);
// }
