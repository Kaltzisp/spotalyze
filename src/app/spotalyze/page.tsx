import React from "react";

export default function Home(): React.JSX.Element {
    return (
        <div className="align-middle justify-items-center p-8">
            <main className="flex flex-col gap-8">
                <span className="flex justify-center gap-5">
                    <button className="nice-button color-norm"
                        type="button">
                        {"Authenticate"}
                    </button>
                    <input className="nice-button color-norm" placeholder="Spotify Track URL" type="text" />
                </span>
                <p className="text-center font-[family-name:var(--font-geist-mono)]">
                    {"Spotalyze. © SOTY 2024"}
                </p>
                <span className="flex justify-center">
                    <button className="nice-button color-invert mr-5"
                        type="button">
                        {"Authenticate"}
                    </button>
                    <button className="nice-button color-invert mr-5"
                        type="button">
                        {"Authenticate"}
                    </button>
                    <button className="nice-button color-invert"
                        type="button">
                        {"Authenticate"}
                    </button>
                </span>
            </main>
        </div>
    );
}
