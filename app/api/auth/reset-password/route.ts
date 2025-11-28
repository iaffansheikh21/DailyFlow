// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import PasswordResetToken from "@/models/PasswordResetToken";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const { token, newPassword } = await req.json();

//     if (!token || !newPassword) {
//       return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//     }

//     const resetDoc = await PasswordResetToken.findOne({ token });
//     if (!resetDoc) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
//     }

//     if (resetDoc.expiresAt < new Date()) {
//       return NextResponse.json({ error: "Token expired" }, { status: 400 });
//     }

//     const user = await User.findById(resetDoc.userId).select("+password");

//     const salt = await bcrypt.genSalt(10);
//     user!.password = await bcrypt.hash(newPassword, salt);
//     await user!.save();

//     await PasswordResetToken.findByIdAndDelete(resetDoc._id);

//     return NextResponse.json({ message: "Password reset successfully" });
//   } catch {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    if (!token || !password)
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 });

    const resetRecord = await PasswordResetToken.findOne({ token });
    if (!resetRecord) return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    if (resetRecord.expiresAt < new Date())
      return NextResponse.json({ message: "Token expired" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(resetRecord.userId, { password: hashedPassword });
    await PasswordResetToken.deleteOne({ _id: resetRecord._id });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
