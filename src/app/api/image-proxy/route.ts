import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      // 👇 This is important for some CDNs
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return new Response("Failed to fetch image", { status: 500 });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*", // 👈 allow cross-origin
      },
    });
  } catch (error) {
    return new Response("Proxy failed", { status: 500 });
  }
}
