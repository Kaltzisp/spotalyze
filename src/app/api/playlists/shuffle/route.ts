import type { NextRequest } from "next/server";
import { Playlist } from "../Playlist";
import { shuffle } from "../../utils";

export async function GET(request: NextRequest): Promise<Response> {
    const playlistUrl = request.nextUrl.searchParams.get("url");
    const spotifyToken = request.cookies.get("spotify_token");
    if (typeof playlistUrl !== "string") {
        return new Response("Missing playlist url.", { status: 400 });
    }
    if (typeof spotifyToken === "undefined") {
        return new Response("Authenticataion required.", { status: 401 });
    }
    const playlist = await Playlist.fromUrl(playlistUrl, spotifyToken.value);
    await Playlist.fromTracks("Shuffled Playlist", shuffle(playlist.trackURIs), null, spotifyToken.value);
    return new Response("Success");
}
