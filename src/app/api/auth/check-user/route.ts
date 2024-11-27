import { BadResponse } from "../../shared/utils";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    const token = request.cookies.get("token")?.value;
    if (typeof token === "undefined") {
        return new BadResponse("Not logged in as Spotify user.", 401);
    }
    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json() as { id: string };
    return new Response(data.id);
}
