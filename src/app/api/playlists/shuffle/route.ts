import type { NextRequest } from "next/server";
import { Playlist } from "../Playlist";
import { shuffle } from "../../utils";

interface CreatePlaylistResponse {
    id: string;
    external_urls: {
        spotify: string;
    };
}

export async function GET(request: NextRequest): Promise<Response> {
    const playlistUrl = request.nextUrl.searchParams.get("url");
    const spotifyToken = request.cookies.get("spotify_token");
    if (typeof playlistUrl !== "string") {
        return new Response("Missing playlist url.", { status: 400 });
    }
    if (typeof spotifyToken === "undefined") {
        return new Response("Authenticataion required.", { status: 401 });
    }
    const playlist = new Playlist(playlistUrl);
    await playlist.getTracks(spotifyToken.value);
    const trackURIs = shuffle(playlist.tracks.map((track) => `spotify:track:${track.id}`));
    const response = await fetch("https://api.spotify.com/v1/users/omgodmez/playlists", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.SPOTIFY_USER_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Shuffled Playlist",
            description: "None",
            public: true
        })
    });
    const data = await response.json() as CreatePlaylistResponse;
    while (trackURIs.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await fetch(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.SPOTIFY_USER_TOKEN}` },
            body: JSON.stringify({ uris: trackURIs.splice(0, 100) })
        });
    }
    console.log(data.external_urls.spotify);
    return new Response("Success");
}
