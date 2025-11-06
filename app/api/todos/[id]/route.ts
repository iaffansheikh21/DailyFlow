// import { NextResponse } from "next/server";
// import  connectDB  from "@/lib/mongodb";
// import Todo from "@/models/Todo";
// import { verifyToken } from "@/lib/auth";
// import mongoose from "mongoose";

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();

//     const todoId = params.id;
//     if (!todoId) return NextResponse.json({ message: "Missing Todo ID" }, { status: 400 });
//     if (!mongoose.Types.ObjectId.isValid(todoId)) {
//       return NextResponse.json({ message: "Invalid Todo ID" }, { status: 400 });
//     }

//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader) throw new Error("No token provided");
//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);


//     const { title, description, dueDate, priority, status } = await req.json();


//     const updatedTodo = await Todo.findOneAndUpdate(
//       { _id: todoId, userId: decoded.userId },
//       { title, description, dueDate, priority, status },
//       { new: true }
//     );

//     if (!updatedTodo) return NextResponse.json({ message: "Todo not found" }, { status: 404 });

//     return NextResponse.json({ message: "Todo updated", todo: updatedTodo });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();

//     const todoId = params.id;
//     if (!todoId) return NextResponse.json({ message: "Missing Todo ID" }, { status: 400 });
//     if (!mongoose.Types.ObjectId.isValid(todoId)) {
//       return NextResponse.json({ message: "Invalid Todo ID" }, { status: 400 });
//     }

//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader) throw new Error("No token provided");
//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);

//     const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, userId: decoded.userId });

//     if (!deletedTodo) return NextResponse.json({ message: "Todo not found" }, { status: 404 });

//     return NextResponse.json({ message: "Todo deleted" });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }

// app/api/auth/todos/[id]/route.ts
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
