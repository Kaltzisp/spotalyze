import { config } from "dotenv";
import { getPlaylistWithDates } from "./playlist.js";

// Config.
config();

// Running script.
await getPlaylistWithDates("https://open.spotify.com/playlist/0RsjpSDr3scjYBPYG71K1f?si=16a6ff5e74124cd0");
