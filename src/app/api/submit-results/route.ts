import { BadResponse, shuffle } from "../shared/utils";
import type { NextRequest } from "next/server";
import { Playlist } from "../shared/Playlist";
import type { Scores } from "../shared/Track";
import type { TextFile } from "@/app/soty/home/page";
import { parse } from "papaparse";

interface TrackResult {
    trackId: string;
    scores: Scores;
}

export async function POST(request: NextRequest): Promise<Response> {
    const playlistUrl = request.nextUrl.searchParams.get("url");
    const spotifyToken = request.cookies.get("spotify_token");

    if (typeof playlistUrl !== "string") {
        return new BadResponse("Missing playlist url.", 400);
    }
    if (typeof spotifyToken === "undefined") {
        return new BadResponse("Authentication required.", 401);
    }

    const files = await request.json() as TextFile[];

    // Parsing submissions from CSV files.
    const submissions = files.map((file) => {
        const csvData = parse(file.content).data as unknown as string[][];

        // Getting headers.
        const headers = csvData.shift()?.map((header) => header.trim().toLowerCase());
        if (typeof headers === "undefined") {
            throw new Error("Missing headers.");
        }
        const idColumn = headers.indexOf("spotify id");
        const rankColumn = headers.indexOf("rank");
        const notesColumn = headers.indexOf("notes");
        if (idColumn === -1 || rankColumn === -1 || notesColumn === -1) {
            throw new Error("Missing required column headers.");
        }

        // Parsing rankings.
        const trackIds = new Set();
        const ranks = new Set();
        const scores = csvData.splice(0, 160).map((row) => {
            const trackId = row[idColumn];
            const trackRank = parseInt(row[rankColumn], 10);
            if (trackIds.has(trackId)) {
                throw new Error(`Duplicate track: ${trackId}`);
            }
            if (ranks.has(trackRank) || trackRank < 1 || trackRank > 160 || !Number.isInteger(trackRank)) {
                throw new Error(`Invalid rank: ${trackRank}`);
            }
            ranks.add(trackRank);
            return {
                id: trackId,
                rank: trackRank,
                note: row[notesColumn]
            };
        });

        return {
            user: file.name,
            tracks: scores
        };
    });

    // Collating submissions into scores.
    const results: { [id: string]: TrackResult } = {};
    submissions.forEach((submission) => {
        submission.tracks.forEach((track) => {
            if (typeof results[track.id] === "undefined") {
                results[track.id] = {
                    trackId: track.id,
                    scores: {}
                };
            }
            results[track.id].scores[submission.user] = {
                rank: track.rank,
                note: track.note
            };
        });
    });

    // Getting playlist and assigning ranks.
    const playlist = await Playlist.fromUrl(playlistUrl, spotifyToken.value);
    playlist.tracks.forEach((track) => {
        track.scores = results[track.id].scores;
    });

    // Sorting by highest scores to lowest -> removing outliers -> total score.
    playlist.tracks = shuffle(playlist.tracks);
    playlist.tracks.sort((a, b) => b.scoreString.localeCompare(a.scoreString));
    playlist.tracks.sort((a, b) => b.scoreNoOutlier - a.scoreNoOutlier);
    playlist.tracks.sort((a, b) => b.scoreVariance - a.scoreVariance);
    playlist.tracks.sort((a, b) => b.scoreTotal - a.scoreTotal);

    // Creating final ranking playlist.
    const rankedPlaylist = await Playlist.fromTracks("2024 SOTY Countdown", playlist.trackURIs, "./data/2024_Image.jpg", spotifyToken.value);
    rankedPlaylist.tracks.forEach((track) => {
        track.scores = results[track.id].scores;
    });
    return new Response(JSON.stringify(rankedPlaylist), { status: 200 });
}
