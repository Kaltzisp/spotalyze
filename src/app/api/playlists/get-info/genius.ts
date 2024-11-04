import { JSDate } from "../JSDate";

interface TrackInfo {
    response: {
        hits: {
            result: {
                title: string;
                artist_names: string;
                release_date_components: {
                    year: number;
                    month: number;
                    day: number;
                };
            };
        }[];
    };
}

function sanitized(name: string): string {
    return name.toLowerCase().split(/[&;[(-,]/gu)[0].replace(/[^a-zA-Z0-9]/gu, "");
}

export async function getReleaseDateFromGenius(trackName: string, artists: string): Promise<JSDate> {
    const token = process.env.GENIUS_ACCESS_TOKEN;
    const response = await fetch(`https://api.genius.com/search?access_token=${token}&q=${trackName} ${artists}`);
    const data = await response.json() as TrackInfo;
    if (data.response.hits.length === 0) {
        throw new Error("No match found");
    }
    const track = data.response.hits[0].result;
    if (sanitized(trackName) !== sanitized(track.title)) {
        throw new Error(`Title mismatch: ${track.title}`);
    }
    if (sanitized(artists) !== sanitized(track.artist_names)) {
        throw new Error(`Artist mismatch: ${track.artist_names}`);
    }
    return new JSDate(`${track.release_date_components.year}-${track.release_date_components.month}-${track.release_date_components.day}`);
}
