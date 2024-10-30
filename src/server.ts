import { Playlist } from "./Classes/Playlist.js";
import { config } from "dotenv";
import express from "express";

config();
const app = express();
const PORT = 3000;

const redirectUri = `http://localhost:${PORT}/success`;

app.get("/", (request, response) => {
    response.send("Abcdefg");
});

app.get("/create-playlist", (request, response) => {
    response.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=playlist-modify-public&redirect_uri=${redirectUri}&response_type=code`);
});

app.get("/success", async (request, response) => {
    const authCode = request.query.code;
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: `code=${authCode}&redirect_uri=${redirectUri}&grant_type=authorization_code`
    });
    const data = await res.json() as { access_token: string };
    response.send(`Spotify access token: ${data.access_token}`);
    const playlist = new Playlist("https://open.spotify.com/playlist/52DDYLZ2am85rMRlYfPqdY?si=1a11b591d14a471f");
    await playlist.getTracks();
    await playlist.createShuffled("Randomized");
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/create-playlist`);
});
