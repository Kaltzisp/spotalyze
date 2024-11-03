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
    let output = "Spotify ID, Artists, Title, Rank, Notes\n";
    output += playlist.tracks.map((track) => `${track.id},"${track.artists}","${track.name}"`).join("\n");
    writeFileSync("./data/Tracks.csv", output, "utf8");
    return new Response("Success");
}
