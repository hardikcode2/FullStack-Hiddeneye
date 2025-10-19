import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getDBConnection } from "@/lib/db";

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hiddeneye_secret_key");
    const { id } = await req.json();

    const db = await getDBConnection();


    // Delete only if user owns the post
    await db.execute(
      "DELETE FROM posts WHERE id = ? AND user_id = ?",
      [id, decoded.id]
    );

  
    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
