export const spotifyRedirectUri = "http://localhost:3000/api/auth/request-token";

export function GET(): Response {
    if (typeof process.env.SPOTIFY_CLIENT_ID === "undefined" || typeof process.env.SPOTIFY_CLIENT_SECRET === "undefined") {
        return new Response("Missing Spotify credentials.", { status: 400 });
    }
    const queryParams = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        redirect_uri: spotifyRedirectUri,
        response_type: "code",
        scope: "playlist-modify-public ugc-image-upload"
    });
    return Response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
}
