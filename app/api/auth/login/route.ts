// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     console.log("🟢 [LOGIN] Route hit");

//     await connectDB();
//     console.log("✅ [LOGIN] Database connected");

//     const { email, password } = await request.json();
//     console.log("📩 [LOGIN] Received:", { email, password });

//     if (!email || !password) {
//       console.warn("⚠️ Missing email or password");
//       return NextResponse.json(
//         { error: "Please provide email and password" },
//         { status: 400 }
//       );
//     }

//     // Find user with password included
//     const userWithPassword = await User.findOne({ email }).select("+password");
//     console.log(
//       "👤 [LOGIN] User found:",
//       userWithPassword ? userWithPassword.email : "No user"
//     );

//     if (!userWithPassword) {
//       console.warn("❌ Invalid email");
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     // 🔑 Use bcrypt.compare directly
//     const isMatch = await bcrypt.compare(password, userWithPassword.password);
//     console.log("🔑 [LOGIN] Password match:", isMatch);

//     if (!isMatch) {
//       console.warn("❌ [LOGIN] Invalid password");
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     // Generate JWT token
//     if (!process.env.JWT_SECRET) {
//       console.error("🚨 Missing JWT_SECRET in environment");
//       return NextResponse.json(
//         { error: "Server misconfiguration" },
//         { status: 500 }
//       );
//     }

//     const token = jwt.sign(
//       { userId: userWithPassword._id, email: userWithPassword.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     console.log("✅ [LOGIN] JWT generated for user:", userWithPassword.email);

//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: userWithPassword._id,
//         name: userWithPassword.name,
//         email: userWithPassword.email,
//       },
//     });
//   } catch (error: any) {
//     console.error("💥 [LOGIN] Error:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"


function generateToken(payload: object) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("Missing JWT_SECRET environment variable")

  return jwt.sign(payload, secret, { expiresIn: "7d" })
}


function sendResponse(
  data: object,
  status: number = 200
) {
  return NextResponse.json(data, { status })
}


export async function POST(request: Request) {
  try {

    await connectDB()


    const { email, password } = await request.json()

  
    if (!email || !password) {
      return sendResponse({ error: "Please provide email and password" }, 400)
    }


    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return sendResponse({ error: "Invalid email or password" }, 401)
    }


    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return sendResponse({ error: "Invalid email or password" }, 401)
    }

    
    const token = generateToken({
      userId: user._id,
      email: user.email,
    })

   
    return sendResponse({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error: any) {
    return sendResponse(
      { error: error.message || "Internal server error" },
      500
    )
  }
}
