import { BadResponse } from "../../shared/utils";
import type { NextRequest } from "next/server";
import { Playlist } from "../../shared/Playlist";
import { writeFileSync } from "fs";

export async function GET(request: NextRequest): Promise<Response> {
    const playlistUrl = request.nextUrl.searchParams.get("url");
    const spotifyToken = request.cookies.get("spotify_token");
    if (typeof playlistUrl !== "string") {
        return new BadResponse("Missing playlist url.", 400);
    }
    if (typeof spotifyToken === "undefined") {
        return new BadResponse("Authentication required.", 401);
    }

    // Getting playlist and track info.
    const playlist = await Playlist.fromUrl(playlistUrl, spotifyToken.value);
    await Promise.all(playlist.tracks.map(async (track) => track.updateReleaseDate()));

    // Writing JSON and CSV.
    const filePath = "./data/PlaylistInfo";
    writeFileSync(`${filePath}.json`, JSON.stringify(playlist, null, 4), "utf8");
    const output = playlist.tracks.map((track) => track.toCsvRow()).join("\n");
    writeFileSync(`${filePath}.csv`, output, "utf8");
    return new Response("Success");
}
