import { BadResponse, shuffle } from "../../shared/utils";
import type { NextRequest } from "next/server";
import { Playlist } from "../../shared/Playlist";

interface CreatePlaylistBody {
    sourcePlaylistUrl?: string;
    trackURIs?: string[];
    shuffle: boolean;
}

export async function POST(request: NextRequest): Promise<Response> {
    const body = await request.json() as CreatePlaylistBody;
    const spotifyToken = request.cookies.get("spotify_token")?.value;
    if (typeof spotifyToken === "undefined") {
        return new BadResponse("Authentication required.", 401);
    }
    if (typeof body.sourcePlaylistUrl === "string") {
        const playlist = await Playlist.fromUrl(body.sourcePlaylistUrl, spotifyToken);
        body.trackURIs = playlist.trackURIs;
    }
    if (typeof body.trackURIs !== "undefined") {
        const uris = body.shuffle ? shuffle(body.trackURIs) : body.trackURIs;
        const playlist = await Playlist.fromTracks("Spotalyze Playlist", uris, null, spotifyToken);
        return new Response(`Playlist created at ${playlist.url}`, { status: 201 });
    }
    return new BadResponse("Missing track URIs.", 500);
}
