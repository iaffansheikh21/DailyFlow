import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Todo from "@/models/Todo"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request) {
  await connectDB()
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) throw new Error("No token provided")
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)

  const todos = await Todo.find({ userId: decoded.userId }).sort({ createdAt: -1 })
  return NextResponse.json({ todos }, { status: 200 })
}

export async function POST(req: Request) {
  await connectDB()
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) throw new Error("No token provided")
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)

  const { title, description, dueDate, priority } = await req.json()
  if (!title) throw new Error("Title is required")

  const todo = await Todo.create({
    title,
    description,
    dueDate,
    priority,
    userId: decoded.userId,
  })

  return NextResponse.json({ todo }, { status: 201 })
}
