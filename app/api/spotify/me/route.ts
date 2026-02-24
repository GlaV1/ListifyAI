import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token yok" }, { status: 401 });
  }

  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Kullanıcı bilgisi alınamadı" },
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json());
}