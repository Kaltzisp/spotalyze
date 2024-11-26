import { BadResponse } from "../../shared/utils";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest): Response {
    const clientId = process.env.SPOTIFY_CLIENT_ID ?? request.cookies.get("client_id")?.value;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? request.cookies.get("client_secret")?.value;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? request.cookies.get("redirect_uri")?.value;
    if (typeof clientId === "string" && typeof clientSecret === "string" && typeof redirectUri === "string") {
        const queryParams = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "playlist-modify-public ugc-image-upload user-modify-playback-state"
        });
        return Response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
    }
    return new BadResponse("Missing Spotify credentials.", 400);
}
