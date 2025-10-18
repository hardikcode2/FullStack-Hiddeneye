import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // ✅ Connect to database
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "hardikSQL2#",
      database: "hiddeneye",
    });

    // ✅ Check if user exists
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const user = rows[0];

    // ✅ Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "hiddeneye_secret_key",
      { expiresIn: "1h" }
    );

    // ✅ Create response and set cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
