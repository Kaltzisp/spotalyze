import React, { useEffect } from "react";
import type { RankedTrack } from "../../home/page";
import { shuffle } from "@/app/api/utils";

export default function UserRanks(props: {
    readonly track: RankedTrack;
}): React.JSX.Element {
    const [scoresVisible, setScoresVisible] = React.useState<number>();
    const scores = shuffle(Object.entries(props.track.scores)).sort((a, b) => a[1].rank - b[1].rank).map(([key, value]) => ({
        user: key,
        notes: value.notes,
        rank: value.rank,
        place: 1
    }));

    for (let i = 0; i < scores.length; i++) {
        if (i > 0 && scores[i].rank === scores[i - 1].rank) {
            scores[i].place = scores[i - 1].place;
        } else {
            scores[i].place = i + 1;
        }
    }

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
            {scores.map((score) => (
                <div className={`flex flex-col flex-1 text-center gap-3 w-[12rem] font-serif duration-1000
                ${scores.length - score.place <= (scoresVisible ?? 0) ? "opacity-100" : "invisible opacity-0"}`} key={score.user}>
                    <span className="text-5xl font-serif">
                        {score.rank}
                        <sup>{getSuffix(score.rank)}</sup>
                    </span>
                    <span className="text-2xl mt-7">{score.user}</span>
                    <span>{`“ ${score.notes.trim()} but the world goes round and round. ”`}</span>
                </div>
            ))}
        </div>
    );
}
