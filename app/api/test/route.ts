// import { NextResponse } from "next/server"

// export async function GET() {
//   return NextResponse.json({ message: "Backend working!" }, { status: 200 })
// }

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// MongoDB connection helper
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

export async function GET(req: Request) {
  try {
    // 1️⃣ Check MongoDB connection
    await connectDB();

    // 2️⃣ Check JWT token if provided
    const authHeader = req.headers.get("Authorization"); // frontend will send 'Bearer <token>'
    let jwtMessage = "No token provided";

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        jwtMessage = `JWT valid! Payload: ${JSON.stringify(decoded)}`;
      } catch (err) {
        jwtMessage = "JWT invalid!";
      }
    }

    // 3️⃣ Return response
    return NextResponse.json({
      message: "Backend working!",
      db: "MongoDB connected successfully!",
      jwt: jwtMessage,
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({
      message: "Error occurred",
      error: err.message
    }, { status: 500 });
  }
}
