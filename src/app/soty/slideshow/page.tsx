"use client";
import React, { useEffect, useState } from "react";
import PlayedTracks from "./Components/PlayedTracks";
import Quote from "./Components/Quote";
import type { RankedTrack } from "@/app/api/playlists/submit-results/route";
import TrackInfo from "./Components/TrackInfo";
import UserRanks from "./Components/UserRanks";
import { useRouter } from "next/navigation";

const quoteDuration = 10000;
const fadeDuration = 1000;
const trackLeadIn = 3000;

export default function Slideshow(): React.JSX.Element {
    const router = useRouter();

    const [tracks, setTracks] = useState<RankedTrack[]>([]);
    const [trackIndex, setTrackIndex] = useState(0);
    const [track, setTrack] = useState<RankedTrack>();
    const [quotes, setQuotes] = useState<string[]>([]);
    const [trackInfoVisible, setTrackInfoVisible] = useState(false);

    const [hideTrackInfoTimeout, setHideTrackInfoTimeout] = useState<NodeJS.Timeout>();
    const [trackIncrementTimeout, setTrackIncrementTimeout] = useState<NodeJS.Timeout>();
    const [showTrackInfoTimeout, setShowTrackInfoTimeout] = useState<NodeJS.Timeout>();

    useEffect(() => {
        const storedTracks = localStorage.getItem("tracks");
        if (storedTracks === null) {
            router.push("/soty/home");
        } else {
            setTracks(JSON.parse(storedTracks) as RankedTrack[]);
            setTrackIndex(0);
        }
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowRight":
                    setTrackIndex((previousIndex) => previousIndex + 1);
                    break;
                case "ArrowLeft":
                    setTrackIndex((previousIndex) => previousIndex - 1);
                    break;
                default:
                    break;
            }
        });
    }, []);

    useEffect(() => {
        setTrackInfoVisible(false);
        clearTimeout(hideTrackInfoTimeout);
        clearTimeout(trackIncrementTimeout);
        clearTimeout(showTrackInfoTimeout);
        if (tracks.length > 0) {
            if (trackIndex < tracks.length) {
                setTrack(tracks[trackIndex]);
            } else {
                router.push("/soty/view");
            }
        }
    }, [trackIndex, tracks]);

    useEffect(() => {
        if (typeof track !== "undefined") {
            setQuotes(Object.values(track.scores).map((result) => result.notes).filter((note) => note !== ""));
            setHideTrackInfoTimeout(setTimeout(() => setTrackInfoVisible(false), track.duration - trackLeadIn));
            setTrackIncrementTimeout(setTimeout(() => setTrackIndex((previousIndex) => previousIndex + 1), track.duration));
        }
    }, [track]);

    useEffect(() => {
        if (quotes.length > 0) {
            setShowTrackInfoTimeout(setTimeout(() => setTrackInfoVisible(true), quoteDuration + fadeDuration / 2));
        }
    }, [quotes]);

    return (
        <main className="flex justify-center items-center">
            <Quote fadeDuration={fadeDuration} quoteDuration={quoteDuration} quotes={quotes} />
            <div className="flex flex-col gap-[5rem] justify-center items-center">
                <PlayedTracks fadeDuration={fadeDuration} trackIndex={trackIndex} tracks={tracks} visible={trackInfoVisible} />
                {track ? <TrackInfo fadeDuration={fadeDuration} quoteDuration={quoteDuration} track={track} trackIndex={trackIndex} visible={trackInfoVisible} /> : null}
                {track ? <UserRanks fadeDuration={fadeDuration} quoteDuration={quoteDuration} track={track} visible={trackInfoVisible} /> : null}
            </div>
        </main >
    );
}
