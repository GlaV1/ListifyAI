import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";
  const response = NextResponse.redirect(new URL("/", baseUrl));
  response.cookies.delete("spotify_token");
  response.cookies.delete("spotify_refresh_token");
  return response;
}
