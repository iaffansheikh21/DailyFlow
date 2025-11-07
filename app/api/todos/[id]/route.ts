import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Todo from "@/models/Todo"
import { verifyToken } from "@/lib/auth"
import mongoose from "mongoose"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) throw new Error("No token provided")
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)

  const { title, description, dueDate, priority, status } = await req.json()
  const todo = await Todo.findOneAndUpdate(
    { _id: params.id, userId: decoded.userId },
    { title, description, dueDate, priority, status },
    { new: true }
  )

  if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 })
  return NextResponse.json({ todo })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) throw new Error("No token provided")
  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token)

  const deleted = await Todo.findOneAndDelete({ _id: params.id, userId: decoded.userId })
  if (!deleted) return NextResponse.json({ error: "Todo not found" }, { status: 404 })
  return NextResponse.json({ message: "Todo deleted" })
}
