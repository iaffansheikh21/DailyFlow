// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { toast } from "react-toastify"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import apiClient from "@/lib/apiClient"

// interface Todo {
//   _id: string
//   title: string
//   description: string
//   priority: "low" | "medium" | "high"
//   dueDate: string
//   status: "todo" | "in-progress" | "done"
//   userId?: string
// }

// interface TodoCardProps {
//   todo: Todo
//   onUpdate: () => void
// }

// export default function TodoCard({ todo, onUpdate }: TodoCardProps) {
//   const [loading, setLoading] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editData, setEditData] = useState({
//     title: todo.title,
//     description: todo.description,
//     priority: todo.priority,
//     status: todo.status,
//     dueDate: todo.dueDate ? todo.dueDate.split("T")[0] : "",
//   })

//   const priorityColors = {
//     low: "bg-blue-500/20 text-blue-400",
//     medium: "bg-yellow-500/20 text-yellow-400",
//     high: "bg-red-500/20 text-red-400",
//   }

//   const statusColors = {
//     todo: "bg-gray-500/20 text-gray-400",
//     "in-progress": "bg-purple-500/20 text-purple-400",
//     done: "bg-green-500/20 text-green-400",
//   }

//   // ✅ Update Todo Status (PATCH/PUT)
//   const handleStatusChange = async (newStatus: string) => {
//     if (newStatus === todo.status) return

//     setLoading(true)
//     try {
//       await apiClient.put(`/api/todos/${todo._id}`, { status: newStatus })
//       toast.success("Status updated successfully")
//       onUpdate()
//     } catch (err: any) {
//       console.error(err)
//       toast.error(err.response?.data?.message || "Failed to update status")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ✅ Save Todo edits
//   const handleUpdate = async () => {
//     if (!editData.title.trim()) return toast.error("Title is required")

//     setLoading(true)
//     try {
//       await apiClient.put(`/api/todos/${todo._id}`, editData)
//       toast.success("Todo updated successfully")
//       setIsEditing(false)
//       onUpdate()
//     } catch (err: any) {
//       console.error(err)
//       toast.error(err.response?.data?.message || "Failed to update todo")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ✅ Delete Todo
//   const handleDelete = async () => {
//     const confirmed = confirm("Are you sure you want to delete this todo?")
//     if (!confirmed) return

//     setLoading(true)
//     try {
//       await apiClient.delete(`/api/todos/${todo._id}`)
//       toast.success("Todo deleted successfully")
//       onUpdate()
//     } catch (err: any) {
//       console.error(err)
//       toast.error(err.response?.data?.message || "Failed to delete todo")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ✅ Edit Mode UI
//   if (isEditing) {
//     return (
//       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
//         <Card className="bg-card border border-border p-4 mb-4">
//           <div className="space-y-3">
//             <input
//               type="text"
//               value={editData.title}
//               onChange={(e) => setEditData({ ...editData, title: e.target.value })}
//               placeholder="Enter title"
//               className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//             />

//             <textarea
//               value={editData.description}
//               onChange={(e) => setEditData({ ...editData, description: e.target.value })}
//               rows={2}
//               placeholder="Enter description"
//               className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//             />

//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 aria-label="Priority level"
//                 value={editData.priority}
//                 onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
//                 className="px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>

//               <input
//                 type="date"
//                 value={editData.dueDate}
//                 onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
//                 title="Due date"
//                 aria-label="Due date"
//                 placeholder="YYYY-MM-DD"
//                 className="px-3 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//               />
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 onClick={handleUpdate}
//                 disabled={loading}
//                 className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
//               >
//                 {loading ? "Saving..." : "Save"}
//               </Button>

//               <Button
//                 onClick={() => setIsEditing(false)}
//                 variant="outline"
//                 className="flex-1"
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </motion.div>
//     )
//   }

//   // ✅ View Mode UI
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Card className="bg-card border-border p-4 mb-4 hover:shadow-md transition-shadow">
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-foreground">{todo.title}</h3>
//             {todo.description && <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
//             {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
//           </span>
//           <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[todo.status]}`}>
//             {todo.status === "todo" && "To Do"}
//             {todo.status === "in-progress" && "In Progress"}
//             {todo.status === "done" && "Done"}
//           </span>
//           {todo.dueDate && (
//             <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
//               {new Date(todo.dueDate).toLocaleDateString()}
//             </span>
//           )}
//         </div>

//         <div className="flex gap-2 flex-wrap">
//           <select
//             aria-label="Change todo status"
//             value={todo.status}
//             onChange={(e) => handleStatusChange(e.target.value)}
//             disabled={loading}
//             className="px-3 py-1 bg-input border border-input rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
//           >
//             <option value="todo">To Do</option>
//             <option value="in-progress">In Progress</option>
//             <option value="done">Done</option>
//           </select>

//           <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" disabled={loading}>
//             Edit
//           </Button>

//           <Button
//             onClick={handleDelete}
//             variant="outline"
//             size="sm"
//             disabled={loading}
//             className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
//           >
//             Delete
//           </Button>
//         </div>
//       </Card>
//     </motion.div>
//   )
// }

// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { toast } from "react-toastify"
// import apiClient from "@/lib/apiClient"

// export default function TodoCard({ todo, onUpdate }: any) {
//   const handleDelete = async () => {
//     try {
//       await apiClient.delete(`/api/todos/${id}`)
//       toast.success("Todo deleted!")
//       onUpdate()
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || "Failed to delete todo")
//     }
//   }

//   const handleStatusToggle = async () => {
//     try {
//       const newStatus = todo.status === "pending" ? "done" : "pending"
//       await apiClient.put(`/api/todos/${id}`, { status: newStatus })
//       toast.success(`Todo marked as ${newStatus}`)
//       onUpdate()
//     } catch (err: any) {
//       toast.error("Failed to update status")
//     }
//   }

//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       className="border border-border rounded-lg bg-card p-4 mb-3 shadow-sm"
//     >
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-lg font-semibold text-foreground">{todo.title}</h3>
//           {todo.description && (
//             <p className="text-muted-foreground text-sm">{todo.description}</p>
//           )}
//           <p className="text-xs mt-1 text-muted-foreground">
//             Priority: {todo.priority} | Status:{" "}
//             <span
//               className={
//                 todo.status === "done" ? "text-green-500 font-medium" : "text-yellow-500 font-medium"
//               }
//             >
//               {todo.status}
//             </span>
//           </p>
//         </div>

//         <div className="flex gap-2">
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={handleStatusToggle}
//             className="text-xs"
//           >
//             {todo.status === "done" ? "Mark Pending" : "Mark Done"}
//           </Button>

//           <Button
//             size="sm"
//             variant="destructive"
//             onClick={handleDelete}
//             className="text-xs"
//           >
//             Delete
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import apiClient from "@/lib/apiClient"

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

  // ✅ Delete Todo
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/todos/${todo._id}`)
      toast.success("Todo deleted")
      onUpdate()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete todo")
    }
  }

  // ✅ Mark Done / Pending toggle
  const handleToggleStatus = async () => {
    try {
      const newStatus = todo.status === "done" ? "pending" : "done"
      await apiClient.put(`/api/todos/${todo._id}`, { status: newStatus })
      toast.success(`Marked as ${newStatus}`)
      onUpdate()
    } catch (err: any) {
      toast.error("Failed to update status")
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

  return (
    <motion.div
      layout
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
              <p className="text-sm text-muted-foreground">{todo.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Priority: {todo.priority}
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
              <Button
                onClick={handleToggleStatus}
                size="sm"
                variant={todo.status === "done" ? "outline" : "default"}
              >
                {todo.status === "done" ? "Mark Pending" : "Mark Done"}
              </Button>
              <Button
                onClick={handleDelete}
                size="sm"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
