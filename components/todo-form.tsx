"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import apiClient from "@/lib/apiClient"
import { useAuth } from "@/context/AuthContext"

interface TodoFormProps {
  onTodoCreated: () => void
}

export default function TodoForm({ onTodoCreated }: TodoFormProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!token) {
      toast.error("You must be logged in to create a todo")
      return
    }

    setLoading(true)
    try {
      await apiClient.post(
        "/api/todos",
        {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
          status: "todo",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success("Todo created successfully!")
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      })
      onTodoCreated()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create todo"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-card border border-border p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Create New Todo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details..."
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                aria-label="Select priority level"
                className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {loading ? "Creating..." : "Create Todo"}
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}
