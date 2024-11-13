import React, { useEffect } from "react";
import type { RankedTrack } from "@/app/api/playlists/submit-results/route";
import { shuffle } from "@/app/api/utils";

export default function UserRanks(props: {
    readonly track: RankedTrack;
}): React.JSX.Element {
    const [scores, setScores] = React.useState<{
        user: string;
        notes: string;
        rank: number;
        place: number;
    }[]>();
    const [scoresVisible, setScoresVisible] = React.useState<number>();

    function getSuffix(number: number): string {
        const suffixes = ["st", "nd", "rd"];
        const lastDigit = number % 10;
        return suffixes[lastDigit - 1] || "th";
    }

    useEffect(() => {
        setTimeout(() => {
            setScoresVisible(0);
            const userScores = shuffle(Object.entries(props.track.scores)).sort((a, b) => a[1].rank - b[1].rank).map(([key, value]) => ({
                user: key,
                notes: value.notes,
                rank: value.rank,
                place: 1
            }));
            for (let i = 0; i < userScores.length; i++) {
                if (i > 0 && userScores[i].rank === userScores[i - 1].rank) {
                    userScores[i].place = userScores[i - 1].place;
                } else {
                    userScores[i].place = i + 1;
                }
            }
            setScores(userScores);
        }, 5000);
    }, [props.track]);

    useEffect(() => {
        if (typeof scoresVisible === "number") {
            if (scoresVisible < (scores?.length ?? 0)) {
                setTimeout(() => {
                    setScoresVisible((previous) => (previous ?? 0) + 1);
                }, 3000);
            }
        }
    }, [scoresVisible]);

    return (
        <div className="mt-[6rem] flex gap-[12rem] justify-center">
            {scores?.map((score) => (
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
