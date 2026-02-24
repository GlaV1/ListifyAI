import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Token yok, tekrar giriş yap" },
      { status: 401 }
    );
  }

  const { tracks } = await req.json();

  if (!Array.isArray(tracks) || tracks.length === 0) {
    return NextResponse.json(
      { error: "Track listesi boş" },
      { status: 400 }
    );
  }

  // Kullanıcı bilgisi
  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!meRes.ok) {
    return NextResponse.json(
      { error: "Kullanıcı bilgisi alınamadı" },
      { status: meRes.status }
    );
  }

  const me = await meRes.json();

  // Playlist adı (counter yerine timestamp)
  const playlistName = `AI List • ${new Date().toLocaleDateString("tr-TR")}`;
  const description = "github.com/GlaV1/spoai tarafından oluşturuldu";

  // Playlist oluştur
  const createRes = await fetch(
    `https://api.spotify.com/v1/users/${me.id}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description,
        public: false,
      }),
    }
  );

  if (!createRes.ok) {
    console.error(await createRes.text());
    return NextResponse.json(
      { error: "Playlist oluşturulamadı" },
      { status: 500 }
    );
  }

  const playlist = await createRes.json();

  // Track search → paralel (çok daha hızlı & güvenli)
  const searchPromises = tracks.slice(0, 20).map((track: any) => {
    const q = encodeURIComponent(`track:${track.name} artist:${track.artist}`);
    return fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => res.ok ? res.json() : null)
      .then(data => data?.tracks?.items?.[0]?.uri)
      .catch(() => null);
  });

  const uris = (await Promise.all(searchPromises)).filter(Boolean);

  if (uris.length > 0) {
    await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
      }
    );
  }

  return NextResponse.json({
    success: true,
    playlistName,
    playlistUrl: playlist.external_urls.spotify,
    tracksAdded: uris.length,
  });
}