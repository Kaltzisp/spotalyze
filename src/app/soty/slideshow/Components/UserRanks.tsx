import React, { useEffect } from "react";
import type { RankedTrack } from "../../home/page";

export default function UserRanks(props: {
    readonly track: RankedTrack;
}): React.JSX.Element {
    const [scoresVisible, setScoresVisible] = React.useState<number>();
    const scores = Object.entries(props.track.scores).sort((a, b) => a[1].rank - b[1].rank);

    function getSuffix(number: number): string {
        const suffixes = ["st", "nd", "rd"];
        const lastDigit = number % 10;
        return suffixes[lastDigit - 1] || "th";
    }

    useEffect(() => {
        setTimeout(() => {
            setScoresVisible(0);
        }, 5000);
    }, [props.track]);

    useEffect(() => {
        if (typeof scoresVisible === "number") {
            if (scoresVisible < scores.length) {
                setTimeout(() => {
                    setScoresVisible((previous) => (previous ?? 0) + 1);
                }, 3000);
            }
        }
    }, [scoresVisible]);

    return (
        <div className="mt-[6rem] flex gap-[12rem] justify-center">
            {scores.map(([key, value], index) => (
                <div className={`flex flex-col flex-1 text-center gap-3 w-[12rem] font-serif duration-1000
                ${scores.length - index <= (scoresVisible ?? 0) ? "opacity-100" : "invisible opacity-0"}`} key={key}>
                    <span className="text-5xl font-serif">
                        {value.rank}
                        <sup>{getSuffix(value.rank)}</sup>
                    </span>
                    <span className="text-2xl mt-7">{key}</span>
                    <span>{`“ ${value.notes.trim()} but the world goes round and round. ”`}</span>
                </div>
            ))}
        </div>
    );
}
