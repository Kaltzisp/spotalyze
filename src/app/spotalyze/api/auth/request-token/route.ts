import type { NextRequest } from "next/server";
import { spotifyRedirectUri } from "../login/route";

export async function GET(request: NextRequest): Promise<Response> {
    const authCode = request.nextUrl.searchParams.get("code");
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: `code=${authCode}&redirect_uri=${spotifyRedirectUri}&grant_type=authorization_code`
    });
    const data = await response.json() as { access_token: string };
    process.env.SPOTIFY_USER_TOKEN = data.access_token;
    return Response.redirect("http://localhost:3000/spotalyze");
}
