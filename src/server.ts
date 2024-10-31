// import { Playlist } from "./Classes/Playlist.js";
import { config } from "dotenv";
import express from "express";
import { fileURLToPath } from 'url';
import { getUserToken } from "./APIs/spotify.js";
import { join } from "path";

// Loading env variables.
config();

// App config.
const app = express();
const PORT = 3000;
const url = `http://localhost:${PORT}`;

app.use(express.static(join(fileURLToPath(import.meta.url), "../../public")));

app.get("/login", (request, response) => {
    const queryParams = [
        `client_id=${process.env.SPOTIFY_CLIENT_ID}`,
        `scope=playlist-modify-public`,
        `redirect_uri=${url}/auth-landing`,
        `response_type=code`
    ].join("&");
    response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/auth-landing", async (request, response) => {
    process.env.SPOTIFY_USER_TOKEN = await getUserToken(request.query.code as string, `${url}/auth-landing`);
    response.redirect("/");
});

// app.get("/create-playlist", async (request, response) => {
//     const playlist = new Playlist("https://open.spotify.com/playlist/31bIESFeWDZSnvFU7yVoMI?si=c8a64e492f7b4029&pt=9f4c3f288531acc56753565c38b569fa");
//     await playlist.getTracks();
//     await playlist.createShuffled("Randomized", data.access_token);
// });


app.listen(PORT, () => {
    console.log(`Server is running at ${url}`);
});
