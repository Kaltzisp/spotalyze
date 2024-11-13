import { JSDate } from "@/app/api/playlists/JSDate";
import type { RankedTrack } from "../../home/page";
import React from "react";

export default function TrackInfo(props: {
    readonly track: RankedTrack;
    readonly trackIndex: number | undefined;
}): React.JSX.Element {
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

    return (
        <div className="flex gap-10 justify-center">
            <img className="max-w-[512px] w-[512px] flex-1 border-white border box-border" src={track.albumImageUrl} />
            <div className="max-w-[512px] flex-1 flex flex-col gap-5">
                <span className="text-4xl">{`# ${160 - (props.trackIndex ?? 0)}`}</span>
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
                    <span className="flex mt-5">
                        <p className="w-[150px]">{"Indieometer: "}</p>
                        <p className="w-[150px] text-center">{`${100 - track.spotifyPopularity}%`}</p>
                    </span>
                    <span className="flex mt-5 text-2xl">
                        <p className="w-[150px]">{"Total score: "}</p>
                        <p className="w-[150px] text-center">{Object.values(props.track.scores).reduce((acc, score) => acc + score.rank, 0)}</p>
                    </span>
                </div>
            </div>
        </div>
    );
}