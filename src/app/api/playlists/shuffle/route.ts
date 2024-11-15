import { BadResponse, shuffle } from "../../shared/utils";
import type { NextRequest } from "next/server";
import { Playlist } from "../../shared/Playlist";

export async function GET(request: NextRequest): Promise<Response> {
    const playlistUrl = request.nextUrl.searchParams.get("url");
    const spotifyToken = request.cookies.get("spotify_token");
    if (typeof playlistUrl !== "string") {
        return new BadResponse("Missing playlist url.", 400);
    }
    if (typeof spotifyToken === "undefined") {
        return new BadResponse("Authentication required.", 401);
    }
    const playlist = await Playlist.fromUrl(playlistUrl, spotifyToken.value);
    await Playlist.fromTracks("Shuffled Playlist", shuffle(playlist.trackURIs), null, spotifyToken.value);
    return new Response("Success");
}
