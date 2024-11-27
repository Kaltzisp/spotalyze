import type { NextRequest } from "next/server";

export function GET(request: NextRequest): Response {
    return Response.redirect(`${request.headers.get("x-forwarded-proto") ?? "http"}://${request.headers.get("host")}/soty/home`);
}
