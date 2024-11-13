"use client";
import React, { useEffect, useState } from "react";
import { JSDate } from "@/app/api/playlists/JSDate";
import type { RankedTrack } from "../home/page";
import { useRouter } from "next/navigation";
import TrackInfo from "./Components/TrackInfo";

export default function Slideshow(): React.JSX.Element {
    const router = useRouter();
    const [tracks, setTracks] = useState<RankedTrack[]>([]);
    const [trackIndex, setTrackIndex] = useState<number>();
    const [track, setTrack] = useState<RankedTrack>();

    const [quote, setQuote] = useState<string>();
    const [quoteVisible, setQuoteVisible] = useState(false);

    const [trackVisible, setTrackVisible] = useState(false);

    /*
     * function randomPick<T>(arr: T[]): T {
     *     return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
     * }
     */

    function getUser(id: string): string {
        switch (id) {
            case "imadale": return "Ari";
            case "omgodmez": return "Pete";
            case "22kbyr6xgy7hm242spzpbvpya": return "Doug";
            case "31c2acpfbyw7zgewg5wxerdyeyye": return "Mog";
            default: return "Unknown";
        }
    }

    function getSuffix(number: number): string {
        const suffixes = ["st", "nd", "rd"];
        const lastDigit = number % 10;
        return suffixes[lastDigit - 1] || "th";
    }


    useEffect(() => {
        const storedTracks = sessionStorage.getItem("tracks");
        if (storedTracks === null) {
            router.push("/soty/home");
        } else {
            setTracks(JSON.parse(storedTracks) as RankedTrack[]);
            setTrackIndex(0);
        }
    }, []);

    useEffect(() => {
        if (typeof trackIndex === "number") {
            if (trackIndex < tracks.length) {
                setTrack(tracks[trackIndex]);
                setTimeout(() => {
                    setTrackIndex(trackIndex + 1);
                }, track?.duration);
            } else {
                router.push("/soty/view");
            }
        }
    }, [trackIndex]);

    useEffect(() => {
        if (typeof track !== "undefined") {
            setTimeout(() => {
                setTrackVisible(false);
            }, track.duration - 1000);

            // Showing a quote.
            const notes = Object.values(track.scores).map((result) => result.notes).filter((note) => note !== "");
            if (notes.length > 0) {
                setQuote(notes[Math.floor(Math.random() * notes.length)]);
                setQuoteVisible(true);
                setTimeout(() => setQuoteVisible(false), 5000);
            }

            // Showing the track.
            setTimeout(() => {
                setTrackVisible(true);
            }, 5500);
        }
    }, [track]);

    return (
        <main className="flex p-8 justify-center">
            {typeof track === "undefined" ? null : <div className="relative flex items-center justify-center">
                <div>
                    <TrackInfo track={track} trackVisible={trackVisible} />
                    <div className="mt-[150px] flex gap-[300px] justify-center">
                        {Object.entries(track.scores).sort((a, b) => a[1].rank - b[1].rank).map(([key, value]) => (
                            <div className="flex flex-col flex-1 text-center gap-5" key={key}>
                                <span className="text-5xl font-serif">
                                    {value.rank}
                                    <sup>{getSuffix(value.rank)}</sup>
                                </span>
                                <span>{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <span className={`fixed p-20 text-5xl font-serif duration-1000 ease-in-out text-justify ${quoteVisible ? "opacity-100" : "invisible opacity-0"}`}>
                    {`“ ${quote?.trim()} ”`}
                </span>
            </div>}
        </main>
    );
}
