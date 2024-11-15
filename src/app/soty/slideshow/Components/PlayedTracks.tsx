import React, { useEffect, useState } from "react";
import type { Track } from "@/app/api/shared/Track";

interface PlayedTracksProps {
    readonly fadeDuration: number;
    readonly tracks: Track[];
    readonly trackIndex: number;
    readonly visible: boolean;
}

const nRecentTracks = 5;

export default function PlayedTracks(props: PlayedTracksProps): React.JSX.Element {
    const [recentTracks, setRecentTracks] = useState<Track[]>([]);

    useEffect(() => {
        if (props.tracks.length > 0) {
            setRecentTracks(props.tracks.slice(Math.max(props.trackIndex - nRecentTracks, 0), props.trackIndex));
        }
    }, [props.trackIndex, props.tracks]);

    return (
        <div className={`flex justify-center items-center gap-[6rem] ease-in-out ${props.visible ? "opacity-100" : "invisible opacity-0"}`}
            style={{ transitionDuration: `${props.fadeDuration}ms` }}>
            {recentTracks.map((track, index) => {
                const trackNumber = 160 - props.trackIndex - index + recentTracks.length;
                const trackName = track.name.replace(/\(.*\)/gu, "").split(" - ")[0].trim();
                return <span className="text-center text-xl" key={trackNumber}>{`${trackNumber}. ${trackName} (${track.scoreTotal})`}</span>;
            })}
        </div>
    );
}
