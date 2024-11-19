import React, { useEffect } from "react";
import { JSDate } from "@/app/api/shared/JSDate";
import type { Track } from "@/app/api/shared/Track";

interface TrackInfoProps {
    readonly fadeDuration: number;
    readonly quoteDuration: number;
    readonly scoreDelay: number;
    readonly track: Track;
    readonly trackIndex: number;
    readonly visible: boolean;
}

export default function TrackInfo(props: TrackInfoProps): React.JSX.Element {
    const [scoreVisible, setScoreVisible] = React.useState(false);
    const [scoreVisibleTimeout, setScoreVisibleTimeout] = React.useState<NodeJS.Timeout>();

    function getUser(id: string): string {
        switch (id) {
            case "imadale": return "Ari";
            case "omgodmez": return "Pete";
            case "22kbyr6xgy7hm242spzpbvpya": return "Doug";
            case "31c2acpfbyw7zgewg5wxerdyeyye": return "Mog";
            default: return "Unknown";
        }
    }

    useEffect(() => {
        clearTimeout(scoreVisibleTimeout);
        if (typeof props.track !== "undefined") {
            setScoreVisible(false);
            if (typeof props.track.scores !== "undefined") {
                setScoreVisibleTimeout(setTimeout(() => {
                    setScoreVisible(true);
                }, props.quoteDuration + props.scoreDelay * Object.keys(props.track.scores).length));
            }
        }
    }, [props.track]);

    return (
        <div className={`flex gap-10 justify-center ease-in-out ${props.visible ? "opacity-100" : "invisible opacity-0"}`}
            style={{ transitionDuration: `${props.fadeDuration}ms` }}>
            <img className="max-w-[512px] w-[512px] flex-1 border-white border box-border" src={props.track.albumImageUrl} />
            <div className="max-w-[512px] w-[512px] flex-1 flex flex-col gap-5">
                {typeof props.trackIndex === "number" ? <span className="text-4xl">
                    {`# ${160 - props.trackIndex}`}
                </span> : null}
                <span className="text-5xl">{props.track.name}</span>
                <span className="text-xl">{props.track.artists.replaceAll(";", ",")}</span>
                <div className="flex flex-col justify-end h-full text-xl">
                    <span className="flex">
                        <p className="w-[150px]">{"Date released: "}</p>
                        <p className="w-[150px] text-center">{new JSDate(props.track.dateReleased).toString()}</p>
                    </span>
                    <span className="flex">
                        <p className="w-[150px]">{"Date added: "}</p>
                        <p className="w-[150px] text-center">{new JSDate(props.track.dateAdded).toString()}</p>
                    </span>
                    <span className="flex mt-5">
                        <p className="w-[150px]">{"Days to add: "}</p>
                        <p className="w-[150px] text-center">{Math.max(Math.floor((new JSDate(props.track.dateAdded).getTime() - new JSDate(props.track.dateReleased).getTime()) / (1000 * 60 * 60 * 24)), 0)}</p>
                    </span>
                    <span className="flex">
                        <p className="w-[150px]">{"Added by: "}</p>
                        <p className="w-[150px] text-center">{getUser(props.track.addedBy)}</p>
                    </span>
                    <span className={`flex mt-10 mb-2 text-3xl ease-in-out ${scoreVisible ? "opacity-100" : "invisible opacity-0"}`}
                        style={{ transitionDuration: `${props.fadeDuration}ms` }}>
                        <p className="w-[150px]">{"Score: "}</p>
                        <p className="w-[150px] text-center">{props.track.scoreTotal}</p>
                    </span>
                </div>
            </div>
        </div>
    );
}
