import { NextResponse } from "next/server";

export function GET(): Response {
    if (typeof process.env.SPOTIFY_CLIENT_ID === "undefined" || typeof process.env.SPOTIFY_CLIENT_SECRET === "undefined" || typeof process.env.SPOTIFY_REDIRECT_URI === "undefined") {
        return NextResponse.json({ error: "Missing environment variables" }, { status: 500 });
    }
    const queryParams = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        response_type: "code",
        scope: "playlist-modify-public ugc-image-upload user-modify-playback-state"
    });
    return Response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
}
