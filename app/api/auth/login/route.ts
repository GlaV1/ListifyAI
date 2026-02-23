import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const scopes = [
    "user-top-read",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-recently-played",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: "http://127.0.0.1:3000/api/auth/callback",
    scope: scopes,
    show_dialog: "true",
  });

  return redirect(`https://accounts.spotify.com/authorize?${params}`);
}