"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import apiClient from "@/lib/apiClient"

interface Todo {
  _id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  status: "todo" | "in-progress" | "done"
  userId?: string
}

interface TodoCardProps {
  todo: Todo
  onUpdate: () => void
}

export default function TodoCard({ todo, onUpdate }: TodoCardProps) {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    status: todo.status,
    dueDate: todo.dueDate ? todo.dueDate.split("T")[0] : "",
  })

  const priorityColors = {
    low: "bg-blue-500/20 text-blue-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-red-500/20 text-red-400",
  }

  const statusColors = {
    todo: "bg-gray-500/20 text-gray-400",
    "in-progress": "bg-purple-500/20 text-purple-400",
    done: "bg-green-500/20 text-green-400",
  }

  // ✅ Update Todo Status (PATCH/PUT)
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === todo.status) return

    setLoading(true)
    try {
      await apiClient.put(`/api/todos/${todo._id}`, { status: newStatus })
      toast.success("Status updated successfully")
      onUpdate()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Save Todo edits
  const handleUpdate = async () => {
    if (!editData.title.trim()) return toast.error("Title is required")

    setLoading(true)
    try {
      await apiClient.put(`/api/todos/${todo._id}`, editData)
      toast.success("Todo updated successfully")
      setIsEditing(false)
      onUpdate()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update todo")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Delete Todo
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this todo?")
    if (!confirmed) return

    setLoading(true)
    try {
      await apiClient.delete(`/api/todos/${todo._id}`)
      toast.success("Todo deleted successfully")
      onUpdate()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to delete todo")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Edit Mode UI
  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="bg-card border border-border p-4 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Enter title"
              className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={2}
              placeholder="Enter description"
              className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="Priority level"
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
                className="px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                title="Due date"
                aria-label="Due date"
                placeholder="YYYY-MM-DD"
                className="px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? "Saving..." : "Save"}
              </Button>

              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  // ✅ View Mode UI
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-card border-border p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{todo.title}</h3>
            {todo.description && <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[todo.status]}`}>
            {todo.status === "todo" && "To Do"}
            {todo.status === "in-progress" && "In Progress"}
            {todo.status === "done" && "Done"}
          </span>
          {todo.dueDate && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
              {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            aria-label="Change todo status"
            value={todo.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={loading}
            className="px-3 py-1 bg-input border border-input rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" disabled={loading}>
            Edit
          </Button>

          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
          >
            Delete
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
