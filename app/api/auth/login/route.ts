import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  /**
   * SAFE Spotify scopes (Free account compatible)
   */
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "playlist-modify-private",
    "playlist-modify-public",
  ].join(" ");

  const redirectUri =
    process.env.NEXT_PUBLIC_REDIRECT_URI ||
    "http://127.0.0.1:3000/api/auth/callback";

  // CSRF koruması için rastgele state üret
  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    state,
    show_dialog: "true",
  });

  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );

  // State cookie (CSRF protection)
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    maxAge: 60 * 10, // 10 dakika
    path: "/",
    sameSite: "lax",
    secure: isProduction,
  });

  return response;
}