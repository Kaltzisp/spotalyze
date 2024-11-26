import { BadResponse } from "../../shared/utils";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest): Response {
    const clientToken = request.cookies.get("client_token");
    const clientSecret = request.cookies.get("client_secret");
    if (typeof clientToken === "string" && typeof clientSecret === "string") {
        process.env.SPOTIFY_CLIENT_ID = clientToken;
        process.env.SPOTIFY_CLIENT_SECRET = clientSecret;
        console.log(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
    }
    if (typeof process.env.SPOTIFY_CLIENT_ID === "undefined" || typeof process.env.SPOTIFY_CLIENT_SECRET === "undefined" || typeof process.env.SPOTIFY_REDIRECT_URI === "undefined") {
        return new BadResponse("Missing Spotify credentials.", 400);
    }
    const queryParams = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        response_type: "code",
        scope: "playlist-modify-public ugc-image-upload user-modify-playback-state"
    });
    return Response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
}
