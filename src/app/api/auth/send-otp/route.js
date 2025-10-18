import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    console.log("Generated OTP:", otp);

    // Insert OTP into database
    await db.execute(
      "INSERT INTO otp_verifications (email, otp, expires_at, verified) VALUES (?, ?, ?, false)",
      [email, otp, expiresAt]
    );

    // Setup SMTP transporter (explicit credentials for now)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "moneymt02@gmail.com",
        pass: "rbsdjnqaqukoneoz", // your Gmail App Password
      },
    });

    await transporter.sendMail({
      from: "HiddenEye <moneymt02@gmail.com>",
      to: email,
      subject: "Your HiddenEye OTP Code",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
    });

    console.log("OTP saved in DB and email sent to:", email);

    return NextResponse.json({ success: true, message: "OTP sent and saved!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ success: false, message: "Failed to send OTP", error });
  }
}
