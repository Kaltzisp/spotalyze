import React, { useEffect } from "react";
import type { Track } from "@/app/api/shared/Track";
import { quotify } from "./Quote";
import { shuffle } from "@/app/api/shared/utils";

interface UserRanksProps {
    readonly fadeDuration: number;
    readonly quoteDuration: number;
    readonly track: Track;
    readonly visible: boolean;
}

export default function UserRanks(props: UserRanksProps): React.JSX.Element {
    const [scores, setScores] = React.useState<{
        user: string;
        notes: string;
        rank: number;
        place: number;
    }[]>([]);

    const [scoresVisible, setScoresVisible] = React.useState(0);
    const [scoresAreVisible, setScoresAreVisible] = React.useState(false);
    const [scoresTimeout, setScoresTimeout] = React.useState<NodeJS.Timeout>();
    const scoreDelay = 5000;

    function getSuffix(number: number): string {
        const suffixes = ["th", "st", "nd", "rd"];
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return "th";
        }
        return suffixes[lastDigit] || "th";
    }

    useEffect(() => {
        setScoresAreVisible(false);
        clearTimeout(scoresTimeout);
        if (typeof props.track.scores !== "undefined") {
            const userScores = shuffle(Object.entries(props.track.scores)).sort((a, b) => a[1].rank - b[1].rank).map(([key, value]) => ({
                user: key,
                notes: value.note,
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
        }
        setScoresVisible(scores.length);
        setScoresTimeout(setTimeout(() => {
            setScoresVisible(1);
            setScoresAreVisible(true);
        }, props.quoteDuration + scoreDelay));
    }, [props.track]);

    useEffect(() => {
        if (scoresVisible < scores.length) {
            setScoresTimeout(setTimeout(() => setScoresVisible((previous) => previous + 1), scoreDelay));
        }
    }, [scoresVisible]);

    return (
        <div className="flex gap-[4rem] justify-center">
            {scores.map((score) => (
                <div className={`flex flex-col flex-1 text-center gap-2 w-[24rem] font-serif ease-in-out ${scores.length - score.place <= scoresVisible - 1 && props.visible && scoresAreVisible ? "opacity-100" : "invisible opacity-0"}`}
                    key={score.user} style={{ transitionDuration: `${props.fadeDuration}ms` }}>
                    <span className="font-serif">
                        <span className="text-5xl">
                            {score.rank}
                        </span>
                        <sup className="align-top top-0.5 text-xl">{getSuffix(score.rank)}</sup>
                    </span>
                    <span className="text-2xl mt-5">{score.user}</span>
                    <span className="text-2xl">{quotify(score.notes)}</span>
                </div>
            ))}
        </div >
    );
}
