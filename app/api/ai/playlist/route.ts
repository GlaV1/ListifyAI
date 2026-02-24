import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Token yok" }, { status: 401 });
  }

  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Mesaj gerekli" }, { status: 400 });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json({ error: "Groq API key eksik" }, { status: 500 });
  }

  const systemPrompt = `Sen bir müzik uzmanı ve playlist küratörüsün.

Kullanıcı senden bir playlist istediğinde gerçek şarkılar öner.

KURALLАР:
- Yanıtını YALNIZCA geçerli JSON olarak ver
- JSON dışında HİÇBİR şey yazma
- Şarkı ve sanatçı isimlerinde asla çift tırnak (") kullanma, tek tırnak da kullanma
- reason alanını çok kısa tut (max 5 kelime)
- 10 şarkı öner

FORMAT (bunu aynen kullan):
{"playlistName":"isim","description":"aciklama","tracks":[{"name":"sarki","artist":"sanatci","reason":"neden"},{"name":"sarki2","artist":"sanatci2","reason":"neden2"}],"message":"kullaniciya mesaj"}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq hata:", errText);
      return NextResponse.json({ error: "AI yanıt veremedi" }, { status: 500 });
    }

    const groqData = await groqRes.json();
    const content = groqData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "AI boş yanıt döndü" }, { status: 500 });
    }

    const playlist = JSON.parse(content);
    return NextResponse.json({ playlist });
  } catch (err) {
    console.error("Playlist hatası:", err);
    return NextResponse.json({ error: "Playlist oluşturulamadı" }, { status: 500 });
  }
}