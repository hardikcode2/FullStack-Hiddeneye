import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Clear the token cookie properly
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",            // Must match path from login
    expires: new Date(0), // Expire immediately
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
