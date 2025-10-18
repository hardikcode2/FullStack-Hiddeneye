import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify token using same secret key as login
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hiddeneye_secret_key");

    // ✅ Connect to MySQL
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "hardikSQL2#",
      database: "hiddeneye",
    });

    // ✅ Fetch user details
    const [rows] = await db.execute(
      "SELECT id, email, college FROM users WHERE id = ?",
      [decoded.id]
    );
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
