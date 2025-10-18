import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hiddeneye_secret_key");

    // Get content and college from frontend
    const { content, college } = await req.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "hardikSQL2#",
      database: "hiddeneye",
    });

    // Insert post with user_id, college, and content
    const [result] = await connection.execute(
      "INSERT INTO posts (user_id, college, content) VALUES (?, ?, ?)",
      [decoded.id, college, content]
    );

    // Fetch the newly created post to return
    const [rows] = await connection.execute(
      "SELECT * FROM posts WHERE id = ?",
      [result.insertId]
    );

    await connection.end();

    return NextResponse.json({ success: true, post: rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
