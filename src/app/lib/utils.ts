export function shuffle<T>(arr: T[]): T[] {
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i >= 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export class BadResponse extends Response {
    public constructor(message: string, status: number) {
        super(JSON.stringify({ error: message }), { status });
    }
}
