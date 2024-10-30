import { Playlist } from "./Classes/Playlist.js";
import { config } from "dotenv";

// Config.
config();

// Running script.
const playlist = new Playlist("https://open.spotify.com/playlist/0Z2CnFqm44t40fcVEi1jjf?si=387b6a716feb4520");
await playlist.getTracks();
playlist.saveTrackIds("test");
