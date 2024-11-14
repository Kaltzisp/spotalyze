import React, { useEffect } from "react";
import type { RankedTrack } from "@/app/api/playlists/submit-results/route";
import { shuffle } from "@/app/api/utils";

interface UserRanksProps {
    readonly fadeDuration: number;
    readonly quoteDuration: number;
    readonly track: RankedTrack;
    readonly visible: boolean;
}

export default function UserRanks(props: UserRanksProps): React.JSX.Element {
    const [scores, setScores] = React.useState<{
        user: string;
        notes: string;
        rank: number;
        place: number;
    }[]>([]);

    const [scoresVisible, setScoresVisible] = React.useState<number>(0);
    const scoreDelay = 5000;

    function getSuffix(number: number): string {
        const suffixes = ["st", "nd", "rd"];
        const lastDigit = number % 10;
        return suffixes[lastDigit - 1] || "th";
    }

    useEffect(() => {
        const nQuotes = Object.values(props.track.scores).map((result) => result.notes).filter((note) => note !== "").length;
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
        setTimeout(() => {
            setScoresVisible(1);
        }, props.quoteDuration * (nQuotes + 1));
    }, [props.track]);

    useEffect(() => {
        if (scoresVisible < scores.length) {
            setTimeout(() => setScoresVisible((previous) => previous + 1), scoreDelay);
        }
    }, [scoresVisible]);

    return (
        <div className="flex gap-[12rem] justify-center">
            {scores.map((score) => (
                <div className={`flex flex-col flex-1 text-center gap-3 w-[12rem] font-serif ease-in-out ${scores.length - score.place <= scoresVisible - 1 && props.visible ? "opacity-100" : "invisible opacity-0"}`} key={score.user}
                    style={{ transitionDuration: `${props.fadeDuration}ms` }}>
                    <span className="text-5xl font-serif">
                        {score.rank}
                        <sup>{getSuffix(score.rank)}</sup>
                    </span>
                    <span className="text-2xl mt-5">{score.user}</span>
                    <span>{`“${score.notes.trim()}${(/[.!?]/gu).test(score.notes.trim().at(-1) ?? score.notes) ? "" : "."}”`}</span>
                </div>
            ))}
        </div >
    );
}
