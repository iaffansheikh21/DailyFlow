"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import TodoForm from "@/components/todo-form"
import TodoCard from "@/components/todo-card"
import { useAuth } from "@/context/AuthContext"
import apiClient from "@/lib/apiClient"

interface Todo {
  _id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  status: "todo" | "in-progress" | "done"
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, token, logout, isLoading: authLoading } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("default")

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login")
    }
  }, [authLoading, token, router])

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true)
      // const res = await apiClient.get("/todos") // ✅ your backend route style (no /api prefix)
      const res = await apiClient.get("/api/todos")
      setTodos(res.data.todos || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch todos. Please try again."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchTodos()
  }, [token])

  const handleLogout = async () => {
    logout()
    toast.success("Logged out successfully!")
    router.push("/login")
  }

  const filteredTodos = todos
    // 1️⃣ Filter by status
    .filter((todo) => (filter === "all" ? true : todo.status === filter))
    // 2️⃣ Filter by search query
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // 3️⃣ Sort by selected option
    .sort((a, b) => {
      if (sortOption === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (sortOption === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return 0
    })


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Todos</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user?.name || user?.email}!
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Todo Form */}
        <TodoForm onTodoCreated={fetchTodos} />

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6"
        >
          {["all", "todo", "in-progress", "done"].map((filterOption) => (
            <Button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              variant={filter === filterOption ? "default" : "outline"}
              className={
                filter === filterOption
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : ""
              }
            >
              {filterOption === "all"
                ? "All"
                : filterOption === "todo"
                  ? "To Do"
                  : filterOption === "in-progress"
                    ? "In Progress"
                    : "Done"}
            </Button>
          ))}
        </motion.div>
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-border rounded-md px-3 py-2 w-full sm:w-1/2 bg-background text-foreground"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
          >
            <option value="default">Sort By</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Todos List */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading todos...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card border border-border rounded-lg"
            >
              <p className="text-muted-foreground text-lg">
                {todos.length === 0
                  ? "No todos yet. Create one to get started!"
                  : "No todos in this category."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredTodos.map((todo) => (
                <TodoCard key={todo._id} todo={todo} onUpdate={fetchTodos} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Stats Section*/}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {todos.filter((t) => t.status === "todo").length}
            </p>
            <p className="text-sm text-muted-foreground">To Do</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {todos.filter((t) => t.status === "in-progress").length}
            </p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {todos.filter((t) => t.status === "done").length}
            </p>
            <p className="text-sm text-muted-foreground">Done</p>
          </div>
        </motion.div> */}
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {todos.filter((t) => t.status === "todo").length}
            </p>
            <p className="text-sm text-muted-foreground">To Do</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {todos.filter((t) => t.status === "in-progress").length}
            </p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {todos.filter((t) => t.status === "done").length}
            </p>
            <p className="text-sm text-muted-foreground">Done</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        {todos.length > 0 && (
          <div className="mt-6 bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(todos.filter((t) => t.status === "done").length / todos.length) *
                    100
                    }%`,
                }}
              ></div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
