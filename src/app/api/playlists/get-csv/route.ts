import { BadResponse } from "../../../lib/utils";
import type { NextRequest } from "next/server";
import { Playlist } from "../../../lib/Playlist";
import { writeFileSync } from "fs";

export async function GET(request: NextRequest): Promise<Response> {
    const filePath = "./data/Tracks.csv";
    const playlistUrl = request.nextUrl.searchParams.get("url");
    const spotifyToken = request.cookies.get("spotify_token");
    if (typeof playlistUrl !== "string") {
        return new BadResponse("Missing playlist url.", 400);
    }
    if (typeof spotifyToken === "undefined") {
        return new BadResponse("Authentication required.", 401);
    }
    const playlist = await Playlist.fromUrl(playlistUrl, spotifyToken.value);
    let output = "Spotify ID, Artists, Title, Rank, Notes\n";
    output += playlist.tracks.map((track) => `${track.id},"${track.artists}","${track.name}"`).join("\n");
    writeFileSync(filePath, output, "utf8");
    return new Response(`Tracks written to ${filePath}.`);
}
