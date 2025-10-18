import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing email or OTP" }, { status: 400 });
    }

    // Get the latest OTP for this email
    const [rows] = await db.execute(
      "SELECT * FROM otp_verifications WHERE email = ? ORDER BY id DESC LIMIT 1",
      [email]
    );

    const record = rows[0];

    if (!record) {
      return NextResponse.json({ error: "No OTP found" }, { status: 400 });
    }

    if (record.verified) {
      return NextResponse.json({ error: "OTP already verified" }, { status: 400 });
    }

    // Check expiration
    const now = new Date();
    if (new Date(record.expires_at) < now) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Check OTP match
    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Mark OTP as verified
    await db.execute(
      "UPDATE otp_verifications SET verified = true WHERE id = ?",
      [record.id]
    );

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Verification failed", details: error.message }, { status: 500 });
  }
}
