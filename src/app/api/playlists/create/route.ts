import { BadResponse } from "../../shared/utils";
import type { NextRequest } from "next/server";
import { Playlist } from "../../shared/Playlist";

export async function GET(request: NextRequest): Promise<Response> {
    const trackString = request.nextUrl.searchParams.get("track_ids");
    const trackURIs = trackString?.split(",").map((trackId) => `spotify:track:${trackId}`);
    const spotifyToken = request.cookies.get("spotify_token")?.value;
    if (typeof trackURIs === "undefined") {
        return new BadResponse("Malformed track IDs object.", 400);
    } else if (typeof spotifyToken === "undefined") {
        return new BadResponse("Authentication required.", 401);
    }
    const playlist = await Playlist.fromTracks("Spotalyze Playlist", trackURIs, null, spotifyToken);
    return new Response(`Playlist created at ${playlist.url}`, { status: 201 });
}
