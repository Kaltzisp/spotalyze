import { Playlist } from "./Classes/Playlist.js";
import { config } from "dotenv";

config();

const playlist = new Playlist("https://open.spotify.com/playlist/52DDYLZ2am85rMRlYfPqdY?si=1a11b591d14a471f");
await playlist.getTracks();
