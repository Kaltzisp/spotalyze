interface TrackResponse {
    response: {
        hits: {
            result: {
                id: number;
                title: string;
                artist_names: string;
                release_date_components?: {
                    year: number;
                    month: number;
                    day: number;
                };
            };
        }[];
    };
}

interface Track {
    query: string;
    name: string;
    artists: string;
    releaseDate: string;
}

export async function getTrackInfo(title: string, artist: string): Promise<Track> {
    const token = process.env.REACT_APP_GENIUS_ACCESS_TOKEN;
    const response = await fetch(`https://api.genius.com/search?access_token=${token}&q=${title} ${artist}`);
    const data = await response.json() as TrackResponse;
    const track = {
        query: title,
        name: title,
        artists: artist,
        releaseDate: "unknown"
    };
    if (data.response.hits[0]) {
        track.name = data.response.hits[0].result.title;
        track.artists = data.response.hits[0].result.artist_names;
        const releaseInfo = data.response.hits[0].result.release_date_components;
        if (releaseInfo) {
            track.releaseDate = `${releaseInfo.year}-${releaseInfo.month}-${releaseInfo.day}`;
        } else {
            track.releaseDate = "2000-1-1";
        }
    }
    return track;
}
