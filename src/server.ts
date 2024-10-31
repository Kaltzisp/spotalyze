import { Playlist } from "./Classes/Playlist.js";
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
    if (!process.env.SPOTIFY_USER_TOKEN) {
        const queryParams = [
            `client_id=${process.env.SPOTIFY_CLIENT_ID}`,
            `scope=playlist-modify-public`,
            `redirect_uri=${url}/auth-landing`,
            `response_type=code`
        ].join("&");
        response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
    } else {
        response.redirect("/");
    }
});

app.get("/auth-landing", async (request, response) => {
    process.env.SPOTIFY_USER_TOKEN = await getUserToken(request.query.code as string, `${url}/auth-landing`);
    response.redirect("/");
});

app.get("/getReleaseDates", async (request, response) => {
    const { id } = request.query;
    const playlist = new Playlist(id as string);
    await playlist.getTracks().catch((e: unknown) => console.error(e));
    await playlist.printWithReleaseDates().catch((e: unknown) => console.error(e));
    response.redirect("/");
});

app.get("/playlistToCSV", async (request, response) => {
    const { id } = request.query;
    const playlist = new Playlist(id as string);
    await playlist.getTracks().catch((e: unknown) => console.error(e));
    playlist.printAsCSV();
    response.redirect("/");
});

app.get("/createShuffled", async (request, response) => {
    const { id } = request.query;
    const playlist = new Playlist(id as string);
    await playlist.getTracks().catch((e: unknown) => console.error(e));
    await playlist.createShuffled("Randomized").catch((e: unknown) => console.error(e));
    response.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running at ${url}`);
});
