import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await PasswordResetToken.findOneAndDelete({ userId: user._id });

    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Todo App <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>Click here to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return NextResponse.json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
