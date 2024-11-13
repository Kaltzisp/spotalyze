import type { NextRequest } from "next/server";
import type { Playlist } from "../Playlist";
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
    const tracks = shuffle(playlist.tracks.map((track) => ({
        ...track,
        scores: results[track.id],
        total: Object.values(results[track.id]).reduce((acc, score) => acc + score.rank, 0)
    }))).sort((a, b) => b.total - a.total);

    return new Response(JSON.stringify(tracks), { status: 200 });
}
