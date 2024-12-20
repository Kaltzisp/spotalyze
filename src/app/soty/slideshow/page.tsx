"use client";
import React, { useEffect, useState } from "react";
import { type StoredTrack, Track } from "@/app/lib/Track";
import PlayedTracks from "./Components/PlayedTracks";
import type { Playlist } from "@/app/lib/Playlist";
import Quote from "./Components/Quote";
import TrackInfo from "./Components/TrackInfo";
import UserRanks from "./Components/UserRanks";
import { useRouter } from "next/navigation";

const quoteDuration = 10000;
const fadeDuration = 1000;
const trackLeadIn = 3000;
const scoreDelay = 5000;
const trackDelay = 3000;

export default function Slideshow(): React.JSX.Element {
    const router = useRouter();

    const [tracks, setTracks] = useState<Track[]>([]);
    const [trackIndex, setTrackIndex] = useState(0);
    const [track, setTrack] = useState<Track>();
    const [quotes, setQuotes] = useState<string[]>([]);
    const [trackInfoVisible, setTrackInfoVisible] = useState(false);

    const [hideTrackInfoTimeout, setHideTrackInfoTimeout] = useState<NodeJS.Timeout>();
    const [trackIncrementTimeout, setTrackIncrementTimeout] = useState<NodeJS.Timeout>();
    const [showTrackInfoTimeout, setShowTrackInfoTimeout] = useState<NodeJS.Timeout>();
    const [token, setToken] = useState("");

    useEffect(() => {
        setToken(document.cookie.split("; ").find((cookie) => cookie.startsWith("spotify_token="))?.split("=")[1] ?? "");
        const playlistJson = localStorage.getItem("Playlist");
        if (playlistJson === null) {
            router.push("/soty/home");
        } else {
            const playlist = JSON.parse(playlistJson) as Playlist;
            playlist.tracks = (playlist.tracks as unknown as StoredTrack[]).map((storedTrack: StoredTrack) => new Track(storedTrack));
            setTracks(playlist.tracks);
            setTrackIndex(160 - 0);
        }
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowRight":
                    setTrackInfoVisible(false);
                    setTimeout(() => setTrackIndex((previousIndex) => previousIndex + 1), 1000);
                    break;
                case "ArrowLeft":
                    setTrackInfoVisible(false);
                    setTimeout(() => setTrackIndex((previousIndex) => previousIndex - 1), 1000);
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
                // router.push("/soty/view");
            }
        }
    }, [trackIndex, tracks]);

    useEffect(() => {
        if (typeof track?.scores !== "undefined") {
            setQuotes(Object.values(track.scores).map((result) => result.note).filter((note) => note !== ""));
            setHideTrackInfoTimeout(setTimeout(() => setTrackInfoVisible(false), track.duration - trackLeadIn));
            setTrackIncrementTimeout(setTimeout(() => setTrackIndex((previousIndex) => previousIndex + 1), track.duration + trackDelay));
            if (typeof token === "string") {
                track.play(token);
            }
        }
    }, [track]);

    useEffect(() => {
        setShowTrackInfoTimeout(setTimeout(() => setTrackInfoVisible(true), quoteDuration + fadeDuration / 2));
    }, [quotes]);

    return (
        <main className="flex justify-center items-center">
            <Quote fadeDuration={fadeDuration} quoteDuration={quoteDuration} quotes={quotes} trackIndex={trackIndex} />
            <div className="flex flex-col gap-[5rem] justify-center items-center">
                <PlayedTracks fadeDuration={fadeDuration} trackIndex={trackIndex} tracks={tracks} visible={trackInfoVisible} />
                {track ? <TrackInfo fadeDuration={fadeDuration} quoteDuration={quoteDuration} scoreDelay={scoreDelay} track={track} trackIndex={trackIndex} visible={trackInfoVisible} /> : null}
                {track ? <UserRanks fadeDuration={fadeDuration} quoteDuration={quoteDuration} scoreDelay={scoreDelay} track={track} visible={trackInfoVisible} /> : null}
            </div>
        </main >
    );
}
