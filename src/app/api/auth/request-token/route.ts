import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    const authCode = request.nextUrl.searchParams.get("code");
    const apiResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: `code=${authCode}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&grant_type=authorization_code`
    });
    const data = await apiResponse.json() as { access_token: string };
    const response = NextResponse.redirect(`${request.headers.get("referer")}soty/home`);
    response.cookies.set("spotify_token", data.access_token, {
        path: "/",
        sameSite: "strict"
    });
    return response;
}
