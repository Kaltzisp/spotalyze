import type { NextRequest } from "next/server";
import { Playlist } from "../Playlist";
import { writeFileSync } from "fs";

export async function GET(request: NextRequest): Promise<Response> {
    const playlistUrl = request.nextUrl.searchParams.get("url");
    const spotifyToken = request.cookies.get("spotify_token");
    if (typeof playlistUrl !== "string") {
        return new Response("Missing playlist url.", { status: 400 });
    }
    if (typeof spotifyToken === "undefined") {
        return new Response("Authenticataion required.", { status: 401 });
    }
    const playlist = new Playlist(playlistUrl);
    await playlist.getTracks(spotifyToken.value);
    playlist.tracks = await Promise.all(playlist.tracks.map(async (track) => track.getEarliestReleaseDate()));

    // Writing to JSON and CSV.
    writeFileSync("./data/PlaylistInfo.json", JSON.stringify(playlist, null, 4), "utf8");
    const output = playlist.tracks.map((track) => track.toCsvRow()).join("\n");
    writeFileSync("./data/Playlists/PlaylistInfo.csv", output, "utf8");
    return new Response("Success");
}
