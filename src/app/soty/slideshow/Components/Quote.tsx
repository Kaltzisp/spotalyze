import React, { useEffect, useState } from "react";

interface QuoteProps {
    readonly quotes: string[];
    readonly quoteDuration: number;
    readonly fadeDuration: number;
}

export default function Quote(props: QuoteProps): React.JSX.Element {
    const [quote, setQuote] = useState<string>();
    const [quoteVisible, setQuoteVisible] = useState(false);
    const [quoteInterval, setQuoteInterval] = useState<NodeJS.Timeout>();

    function randomPick<T>(arr: T[]): T {
        return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    }

    function cycleQuote(string: string): void {
        setQuote(string);
        setQuoteVisible(true);
        setTimeout(() => setQuoteVisible(false), props.quoteDuration - props.fadeDuration);
    }

    useEffect(() => {
        clearInterval(quoteInterval);
        if (props.quotes.length > 0) {
            const quoteList = [...props.quotes];
            cycleQuote(randomPick(quoteList));
            setQuoteInterval(setInterval(() => {
                if (quoteList.length > 0) {
                    cycleQuote(randomPick(quoteList));
                } else {
                    clearInterval(quoteInterval);
                }
            }, props.quoteDuration));
        }
    }, [props.quotes]);

    return (
        <span className={`fixed pl-20 pr-20 text-5xl font-serif text-justify ease-in-out duration-${props.fadeDuration} ${quoteVisible ? "opacity-100" : "invisible opacity-0"}`}
            style={{ transitionDuration: `${props.fadeDuration}ms` }}>
            {typeof quote === "undefined" ? null : `“${quote.trim()}”`}
        </span>
    );
}
