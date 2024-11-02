export function GET(request: Request): Response {
    const queryParams = [
        `client_id=${process.env.SPOTIFY_CLIENT_ID}`,
        "scope=playlist-modify-public",
        `redirect_uri=${request.headers.get("referer")?.split("?").shift()}`,
        "response_type=code"
    ].join("&");
    return Response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
}
