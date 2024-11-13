import type { RankedTrack } from "@/app/api/playlists/submit-results/route";
import React from "react";

export default function PlayedTracks(props: {
    readonly playedTracks: RankedTrack[];
    readonly trackIndex: number | undefined;
}): React.JSX.Element {
    const recentTracks = props.playedTracks.slice(-6, props.playedTracks.length - 1);
    return (
        <div className="flex justify-center gap-[6rem] mb-[6rem]">
            {recentTracks.map((track, index) => {
                const trackNumber = 160 - (props.trackIndex ?? 0) - index + recentTracks.length;
                const trackName = track.name.replace(/\(.*\)/gu, "").split(" - ")[0].trim();
                const trackScore = Object.values(track.scores).reduce((acc, score) => acc + score.rank, 0);
                return <span className="text-center" key={trackNumber}>{`${trackNumber}. ${trackName} (${trackScore})`}</span>;
            })}
        </div>
    );
}
