import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get("oauth_state")?.value;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";
  const redirectUri =
    process.env.NEXT_PUBLIC_REDIRECT_URI ||
    "http://127.0.0.1:3000/api/auth/callback";
  const isProduction = process.env.NODE_ENV === "production";

  // CSRF kontrolü — state eşleşmeli
  if (!state || !storedState || state !== storedState) {
    console.error("CSRF state uyuşmazlığı");
    return NextResponse.redirect(new URL("/?error=guvenlik_hatasi", baseUrl));
  }

  if (error || !code) {
    return NextResponse.redirect(new URL("/?error=erisim_reddedildi", baseUrl));
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Token hatası:", await tokenRes.text());
      return NextResponse.redirect(new URL("/?error=token_hatasi", baseUrl));
    }

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/?error=token_yok", baseUrl));
    }

    const response = NextResponse.redirect(new URL("/dashboard", baseUrl));

    // State cookie'yi temizle
    response.cookies.delete("oauth_state");

    // Token cookie'leri — production'da secure
    response.cookies.set("spotify_token", tokens.access_token, {
      httpOnly: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
      secure: isProduction,
    });

    if (tokens.refresh_token) {
      response.cookies.set("spotify_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
        secure: isProduction,
      });
    }

    return response;
  } catch (err) {
    console.error("Callback hatası:", err);
    return NextResponse.redirect(new URL("/?error=sunucu_hatasi", baseUrl));
  }
}