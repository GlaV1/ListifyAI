import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Token yok, tekrar giriş yap" },
      { status: 401 }
    );
  }

  const timeRange =
    req.nextUrl.searchParams.get("time_range") ?? "medium_term";

  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error(await res.text());
    return NextResponse.json(
      { error: "Spotify top tracks alınamadı" },
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json());
}