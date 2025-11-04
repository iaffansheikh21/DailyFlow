import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
