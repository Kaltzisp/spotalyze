import { NextResponse } from "next/server";

export function GET(): NextResponse {
    return NextResponse.json({
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        data: process.env
    });
}

