import type { JSDate } from "../JSDate";
import type { NextRequest } from "next/server";
import { Playlist } from "../Playlist";
import type { TextFile } from "@/app/soty/home/page";
import { parse } from "papaparse";
import { readFileSync } from "fs";
import { shuffle } from "../../utils";

export interface TrackResults {
    [owner: string]: {
        rank: number;
        notes: string;
    };
}

interface Results {
    [trackId: string]: TrackResults;
}

export interface RankedTrack {
    id: string;
    addedBy: string;
    albumImageUrl: string;
    artists: string;
    dateAdded: JSDate;
    dateReleased: JSDate;
    duration: number;
    name: string;
    scores: TrackResults;
    spotifyPopularity: number;
    total: number;
}

function rankString(track: RankedTrack): string {
    return Object.values(track.scores).sort((a, b) => a.rank - b.rank).map((score) => score.rank.toString().padStart(3, "0")).join("");
}

function rankWithoutOutlier(track: RankedTrack): number {
    const ranks = Object.values(track.scores).map((score) => score.rank);
    const mean = ranks.reduce((acc, rank) => acc + rank, 0) / ranks.length;
    const scores = ranks.map((rank) => ({
        rank,
        variance: Math.abs(rank - mean)
    }));
    scores.sort((a, b) => a.variance - b.variance).pop();
    return scores.reduce((acc, score) => acc + score.rank, 0);
}

export async function POST(request: NextRequest): Promise<Response> {
    const files = await request.json() as TextFile[];

    // Parsing submissions from CSV files.
    const submissions = files.map((file) => {
        const csvData = parse(file.content).data as unknown as string[][];
        const headers = csvData[0].map((header) => header.trim().toLowerCase());
        const idColumn = headers.indexOf("spotify id");
        const rankColumn = headers.indexOf("rank");
        const notesColumn = headers.indexOf("notes");
        if (idColumn === -1 || rankColumn === -1 || notesColumn === -1) {
            console.error(`Failed to parse headers from ${file.name}`);
            return null;
        }
        const ranking: (string | undefined)[] = new Array<string>(160);
        const notes: (string | undefined)[] = new Array<string>(160);
        for (let i = 1; i <= 160; i++) {
            const trackRank = parseInt(csvData[i][rankColumn], 10);
            ranking[trackRank - 1] = csvData[i][idColumn];
            notes[trackRank - 1] = csvData[i][notesColumn];
        }
        if (ranking.some((trackId) => typeof trackId === "undefined")) {
            console.error(`Failed to parse rankings from ${file.name}`);
            return null;
        }
        return {
            owner: file.name,
            ranking: ranking as string[],
            notes: notes as string[]
        };
    }).filter((submission) => submission !== null);

    // Collating submissions into scores.
    const results: Results = {};
    submissions.forEach((submission) => {
        submission.ranking.forEach((trackId, index) => {
            if (typeof results[trackId] === "undefined") {
                results[trackId] = {};
            }
            results[trackId][submission.owner] = {
                rank: index + 1,
                notes: submission.notes[index]
            };
        });
    });

    const playlist = JSON.parse(readFileSync("./data/PlaylistInfo.json", "utf8")) as Playlist;
    const tracks: RankedTrack[] = shuffle(playlist.tracks.map((track) => ({
        addedBy: track.addedBy,
        albumImageUrl: track.albumImageUrl,
        artists: track.artists,
        dateAdded: track.dateAdded,
        dateReleased: track.dateReleased,
        duration: track.duration,
        id: track.id,
        name: track.name,
        scores: results[track.id],
        spotifyPopularity: track.spotifyPopularity,
        total: Object.values(results[track.id]).reduce((acc, score) => acc + score.rank, 0)
    })));

    // Sorting by highest scores to lowest -> removing outliers -> total score.
    tracks.sort((a, b) => rankString(a).localeCompare(rankString(b)));
    tracks.sort((a, b) => rankWithoutOutlier(a) - rankWithoutOutlier(b));
    tracks.sort((a, b) => b.total - a.total);

    // Creating final ranking playlist.
    const trackURIs = tracks.map((track) => `spotify:track:${track.id}`);
    const newPlaylistUrl = await Playlist.create(trackURIs, "2024 SOTY Countdown", "It begins...", "./data/2024_Image.jpg");
    console.log(`Created playlist: ${newPlaylistUrl}`);
    return new Response(JSON.stringify(tracks), { status: 200 });
}
