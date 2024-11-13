import React, { useEffect, useState } from "react";
import type { RankedTrack } from "@/app/api/playlists/submit-results/route";

interface PlayedTracksProps {
    readonly fadeDuration: number;
    readonly tracks: RankedTrack[];
    readonly trackIndex: number;
    readonly visible: boolean;
}

const nRecentTracks = 5;

export default function PlayedTracks(props: PlayedTracksProps): React.JSX.Element {
    const [recentTracks, setRecentTracks] = useState<RankedTrack[]>([]);

    useEffect(() => {
        if (props.tracks.length > 0) {
            setRecentTracks(props.tracks.slice(props.trackIndex - nRecentTracks, props.trackIndex));
        }
    }, [props.trackIndex]);

    return (
        <div className={`top-[3rem] fixed flex justify-center items-center gap-[6rem] ease-in-out duration-${props.fadeDuration} ${props.visible ? "opacity-100" : "invisible opacity-0"}`}>
            {recentTracks.map((track, index) => {
                const trackNumber = 160 - props.trackIndex - index + recentTracks.length;
                const trackName = track.name.replace(/\(.*\)/gu, "").split(" - ")[0].trim();
                const trackScore = Object.values(track.scores).reduce((acc, score) => acc + score.rank, 0);
                return <span className="text-center" key={trackNumber}>{`${trackNumber}. ${trackName} (${trackScore})`}</span>;
            })}
        </div>
    );
}
