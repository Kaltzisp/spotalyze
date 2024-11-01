export async function GET(request: Request): Promise<void> {
    console.log("Button clicked");
    return new Response("Succcess!", {
        status: 200
    });
}
