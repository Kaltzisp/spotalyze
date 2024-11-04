import { JSDate } from "../JSDate";

interface RecordingInfo {
    recordings: {
        "first-release-date": string;
    }[];
    error?: string;
}

export async function getReleaseDateFromIsrc(isrc: string): Promise<JSDate> {
    const response = await fetch(`https://musicbrainz.org/ws/2/recording?query=isrc:${isrc}&fmt=json`, {
        headers: {
            "User-Agent": "Kaltzisp/1.0"
        }
    });
    const data = await response.json() as RecordingInfo;
    if (typeof data.error === "string") {
        await new Promise((resolve) => { setTimeout(resolve, 2000) });
        return getReleaseDateFromIsrc(isrc);
    }
    if (data.recordings.length === 0) {
        throw new Error("No match found");
    } else if (data.recordings.length > 1) {
        console.warn("Multiple matches found, using first available.");
    }
    return new JSDate(data.recordings[0]["first-release-date"]);
}
