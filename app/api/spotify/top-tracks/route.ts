import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token yok" }, { status: 401 });
  }

  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}