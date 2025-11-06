// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Todo from "@/models/Todo";
// import { verifyToken } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     // Extract token from Authorization header
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader) throw new Error("No token provided");
//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token); // { userId, email }

//     // Get todo details from request body
//     const { title, description, dueDate, priority } = await req.json();
//     if (!title) throw new Error("Title is required");

//     const newTodo = await Todo.create({
//       title,
//       description,
//       dueDate,
//       priority,
//       userId: decoded.userId,
//     });

//     return NextResponse.json({ message: "Todo created successfully", todo: newTodo }, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }
// export async function GET(req: Request) {
//   try {
//     await connectDB();

//     // JWT verification
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader) throw new Error("No token provided");
//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token); // { userId, email }

//     // Fetch all todos for this user
//     const todos = await Todo.find({ userId: decoded.userId }).sort({ createdAt: -1 });

//     return NextResponse.json({ todos }, { status: 200 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 401 });
//   }
// }

// app/api/auth/todos/route.ts
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
