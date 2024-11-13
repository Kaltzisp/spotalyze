"use client";
import React, { useEffect, useState } from "react";
import PlayedTracks from "./Components/PlayedTracks";
import type { RankedTrack } from "@/app/api/playlists/submit-results/route";
import TrackInfo from "./Components/TrackInfo";
import UserRanks from "./Components/UserRanks";
import { useRouter } from "next/navigation";

export default function Slideshow(): React.JSX.Element {
    const router = useRouter();
    const fadeInPrelude = 3000;
    const fadeDuration = 1000;
    const quoteDuration = 5000;

    const [tracks, setTracks] = useState<RankedTrack[]>([]);
    const [trackIndex, setTrackIndex] = useState<number>();
    const [track, setTrack] = useState<RankedTrack>();
    const [playedTracks, setPlayedTracks] = useState<RankedTrack[]>([]);

    const [quote, setQuote] = useState<string>();
    const [quoteVisible, setQuoteVisible] = useState(false);
    const [trackVisible, setTrackVisible] = useState(false);

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
            } else {
                router.push("/soty/view");
            }
        }
    }, [trackIndex]);

    useEffect(() => {
        if (typeof track !== "undefined") {
            // Adding to played tracks.
            setPlayedTracks([...playedTracks, track]);

            // Incrementing the track index.
            setTimeout(() => {
                setTrackIndex((previousIndex) => (previousIndex ?? 0) + 1);
            }, track.duration);
            setTimeout(() => {
                setTrackVisible(false);
            }, track.duration - fadeInPrelude);

            // Showing a quote.
            const notes = Object.values(track.scores).map((result) => result.notes).filter((note) => note !== "");
            if (notes.length > 0) {
                setQuote(notes[Math.floor(Math.random() * notes.length)]);
                setQuoteVisible(true);
                setTimeout(() => setQuoteVisible(false), quoteDuration);
            }

            // Showing the track.
            setTimeout(() => {
                setTrackVisible(true);
            }, quoteDuration + fadeDuration / 2);
        }
    }, [track]);

    return (
        <main className="flex p-8 justify-center">
            {typeof track === "undefined" ? null : <div className="relative flex flex-col items-center justify-center">
                <div className={`duration-${fadeDuration} ease-in-out ${trackVisible ? "opacity-100" : "invisible opacity-0"}`}>
                    <PlayedTracks playedTracks={playedTracks} trackIndex={trackIndex} />
                    <TrackInfo track={track} trackIndex={trackIndex} tracks={tracks} />
                    <UserRanks track={track} />
                </div>
                <span className={`fixed p-20 text-5xl font-serif duration-${fadeDuration} ease-in-out text-justify ${quoteVisible ? "opacity-100" : "invisible opacity-0"}`}>
                    {`“ ${quote?.trim()} ”`}
                </span>
            </div>}
        </main>
    );
}
