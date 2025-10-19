import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getDBConnection } from "@/lib/db";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hiddeneye_secret_key");

    const db = await getDBConnection();


    const [rows] = await db.execute(
      "SELECT id, content, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC",
      [decoded.id]
    );
    

    // Wrap in { posts: [...] } to match frontend
    return NextResponse.json({ posts: rows });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
