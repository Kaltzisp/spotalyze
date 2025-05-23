import React, { useEffect, useState } from "react";

interface QuoteProps {
    readonly quotes: string[];
    readonly quoteDuration: number;
    readonly fadeDuration: number;
    readonly trackIndex: number;
}

export function quotify(note: string): string {
    const trimmedQuote = note.trim();
    if (trimmedQuote === "") {
        return "";
    }
    const lastChar = trimmedQuote.trim().at(-1);
    if (typeof lastChar !== "undefined" && (/[.!?]/gu).test(lastChar)) {
        return `“${trimmedQuote}”`;
    }
    return `“${trimmedQuote}.”`;
}

export default function Quote(props: QuoteProps): React.JSX.Element {
    const [quote, setQuote] = useState<string>();
    const [quoteVisible, setQuoteVisible] = useState(false);
    const [quoteTimeout, setQuoteTimeout] = useState<NodeJS.Timeout>();

    function randomPick<T>(arr: T[]): T {
        return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    }

    function cycleQuote(string: string): void {
        setQuote(string);
        setQuoteVisible(true);
        setQuoteTimeout(setTimeout(() => setQuoteVisible(false), props.quoteDuration - props.fadeDuration));
    }

    useEffect(() => {
        clearTimeout(quoteTimeout);
        if (props.quotes.length > 0) {
            const quoteList = [...props.quotes];
            cycleQuote(randomPick(quoteList));
        } else {
            const quoteList = ["One of the Songs of 2024."];
            cycleQuote(randomPick(quoteList));
        }
    }, [props.quotes]);

    return (
        <div className={`fixed pl-20 pr-20 text-5xl font-serif text-justify ease-in-out duration-${props.fadeDuration} ${quoteVisible ? "opacity-100" : "invisible opacity-0"}`}
            style={{ transitionDuration: `${props.fadeDuration}ms` }}>
            <span className="flex justify-center">{`#${160 - props.trackIndex}`}</span>
            <br />
            <span>{typeof quote === "undefined" ? null : quotify(quote)}</span>
        </div>
    );
}
