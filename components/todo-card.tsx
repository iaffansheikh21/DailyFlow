"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import apiClient from "@/lib/apiClient"
import ConfirmModal from "@/components/ConfirmModal" // ✅ Added

interface TodoCardProps {
  todo: {
    _id: string
    title: string
    description: string
    priority: "low" | "medium" | "high"
    dueDate: string
    status: "pending" | "done"
  }
  onUpdate: () => void
}

export default function TodoCard({ todo, onUpdate }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)

  // ✅ Added confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDoneModal, setShowDoneModal] = useState(false)

  // ✅ Delete Todo
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/todos/${todo._id}`)
      toast.success("Todo deleted!")
      onUpdate()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete todo.")
    }
  }

  // ✅ Mark Done / Pending toggle
  const handleToggleStatus = async () => {
    try {
      const newStatus = todo.status === "done" ? "pending" : "done"
      await apiClient.put(`/api/todos/${todo._id}`, { status: newStatus })
      toast.success(`Todo marked as ${newStatus}!`)
      onUpdate()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update todo.")
    }
  }

  // ✅ Save edited title/description
  const handleSave = async () => {
    try {
      await apiClient.put(`/api/todos/${todo._id}`, {
        title: editTitle,
        description: editDescription,
      })
      toast.success("Todo updated")
      setIsEditing(false)
      onUpdate()
    } catch (err: any) {
      toast.error("Failed to update todo")
    }
  }

  const priorityColor =
    todo.priority === "high"
      ? "text-red-500"
      : todo.priority === "medium"
      ? "text-yellow-500"
      : "text-green-500"

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm"
      >
        {isEditing ? (
          <div className="space-y-2">
            <input
              className="w-full border rounded p-2 text-foreground bg-background"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded p-2 text-foreground bg-background"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    todo.status === "done"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {todo.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {todo.description}
                </p>
                <p className={`text-xs mt-1 font-medium ${priorityColor}`}>
                  Priority: {todo.priority.toUpperCase()}
                </p>
                {todo.dueDate && (
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>

                {/* ✅ Changed: Opens confirmation modal instead of direct call */}
                <Button
                  onClick={() => setShowDoneModal(true)}
                  size="sm"
                  disabled={todo.status === "done"}
                  className={
                    todo.status === "done"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }
                >
                  {todo.status === "done" ? "Completed" : "Mark Done"}
                </Button>

                {/* ✅ Changed: Opens confirmation modal instead of direct call */}
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  size="sm"
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ✅ Added confirmation modals */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDelete()
          setShowDeleteModal(false)
        }}
        title="Delete Todo?"
        description="Are you sure you want to delete this todo? This action cannot be undone."
        confirmText="Delete"
      />

      <ConfirmModal
        open={showDoneModal}
        onClose={() => setShowDoneModal(false)}
        onConfirm={() => {
          handleToggleStatus()
          setShowDoneModal(false)
        }}
        title="Mark Todo as Done?"
        description="This will mark your todo as completed."
        confirmText="Mark Done"
      />
    </>
  )
}
