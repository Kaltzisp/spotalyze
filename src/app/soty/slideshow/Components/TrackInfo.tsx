import React, { useEffect } from "react";
import { JSDate } from "@/app/api/playlists/JSDate";
import type { RankedTrack } from "@/app/api/playlists/submit-results/route";

interface TrackInfoProps {
    readonly quoteDuration: number;
    readonly nQuotes: number;
    readonly track: RankedTrack;
    readonly trackIndex: number;
    readonly tracks: RankedTrack[];
}

export default function TrackInfo(props: TrackInfoProps): React.JSX.Element {
    const [scoreVisible, setScoreVisible] = React.useState(false);
    const track = props.track;

    function getUser(id: string): string {
        switch (id) {
            case "imadale": return "Ari";
            case "omgodmez": return "Pete";
            case "22kbyr6xgy7hm242spzpbvpya": return "Doug";
            case "31c2acpfbyw7zgewg5wxerdyeyye": return "Mog";
            default: return "Unknown";
        }
    }

    function isTied(rankedTrack: RankedTrack): boolean {
        return props.tracks.filter((tr) => tr.place === rankedTrack.place).length > 1;
    }

    useEffect(() => {
        if (typeof props.track !== "undefined") {
            setTimeout(() => {
                setScoreVisible(true);
            }, props.quoteDuration * (props.nQuotes + Object.keys(track.scores).length));
        }
    }, [props.track]);

    return (
        <div className="flex gap-10 justify-center">
            <img className="max-w-[512px] w-[512px] flex-1 border-white border box-border" src={track.albumImageUrl} />
            <div className="max-w-[512px] w-[512px] flex-1 flex flex-col gap-5">
                {typeof props.trackIndex === "number" ? <span className="text-4xl">
                    {`# ${isTied(track) ? "=" : ""}${track.place}`}
                </span> : null}
                <span className="text-5xl">{track.name}</span>
                <span className="text-xl">{track.artists.replaceAll(";", ",")}</span>
                <div className="flex flex-col justify-end h-full text-xl">
                    <span className="flex">
                        <p className="w-[150px]">{"Date released: "}</p>
                        <p className="w-[150px] text-center">{new JSDate(track.dateReleased).dateString()}</p>
                    </span>
                    <span className="flex">
                        <p className="w-[150px]">{"Date added: "}</p>
                        <p className="w-[150px] text-center">{new JSDate(track.dateAdded).dateString()}</p>
                    </span>
                    <span className="flex mt-5">
                        <p className="w-[150px]">{"Days to add: "}</p>
                        <p className="w-[150px] text-center">{Math.max(Math.floor((new Date(track.dateAdded).getTime() - new Date(track.dateReleased).getTime()) / (1000 * 60 * 60 * 24)), 0)}</p>
                    </span>
                    <span className="flex">
                        <p className="w-[150px]">{"Added by: "}</p>
                        <p className="w-[150px] text-center">{getUser(track.addedBy)}</p>
                    </span>
                    <span className={`flex mt-10 mb-2 text-3xl duration-1000 ease-in-out ${scoreVisible ? "opacity-100" : "invisible opacity-0"}`}>
                        <p className="w-[150px]">{"Score: "}</p>
                        <p className="w-[150px] text-center">{props.track.total}</p>
                    </span>
                </div>
            </div>
        </div>
    );
}
