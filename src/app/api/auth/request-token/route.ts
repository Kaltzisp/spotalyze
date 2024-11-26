import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    const authCode = request.nextUrl.searchParams.get("code");
    const clientId = process.env.SPOTIFY_CLIENT_ID ?? request.cookies.get("client_id")?.value;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? request.cookies.get("client_secret")?.value;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? request.cookies.get("redirect_uri")?.value;
    const apiResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: `code=${authCode}&redirect_uri=${redirectUri}&grant_type=authorization_code`
    });
    const data = await apiResponse.json() as { access_token: string };
    const response = NextResponse.redirect("https://main.d3hq5x9dp1vs3p.amplifyapp.com/soty/home");
    response.cookies.set("spotify_token", data.access_token, {
        path: "/",
        sameSite: "strict"
    });
    return response;
}
