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
