import { NextResponse } from "next/server";
import { getDBConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const db = await getDBConnection();
    const { college, email, password, confirmPassword } = await req.json();
      


    // 🧩 Log the received data
    console.log("Received signup data:", { email, password, confirmPassword, college });

    if (!email || !password || !confirmPassword || !college) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const [otpRows] = await db.execute(
      "SELECT * FROM otp_verifications WHERE email = ? ORDER BY id DESC LIMIT 1",
      [email]
    );
    const latestOtp = otpRows[0];

    if (!latestOtp || !latestOtp.verified) {
      return NextResponse.json({ error: "Email not verified with OTP" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (college, email, password) VALUES (?, ?, ?)",
      [college, email, hashedPassword]
    );

    return NextResponse.json({ success: true, message: "Account created successfully" });
  } catch (err) {
    console.error("Account creation error:", err);
    return NextResponse.json(
      { error: "Failed to create account", details: err.message },
      { status: 500 }
    );
  }
}
