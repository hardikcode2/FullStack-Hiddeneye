import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hiddeneye_secret_key");
    const { id } = await req.json();

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "hardikSQL2#",
      database: "hiddeneye",
    });

    // Delete only if user owns the post
    await connection.execute(
      "DELETE FROM posts WHERE id = ? AND user_id = ?",
      [id, decoded.id]
    );

    await connection.end();
    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
