import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hiddeneye_secret_key");

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "hardikSQL2#",
      database: "hiddeneye",
    });

    const [rows] = await connection.execute(
      "SELECT id, content, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC",
      [decoded.id]
    );
    await connection.end();

    // Wrap in { posts: [...] } to match frontend
    return NextResponse.json({ posts: rows });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
