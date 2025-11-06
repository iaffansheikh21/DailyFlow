// import axios from "axios"

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

// const apiClient = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Attach JWT token from localStorage to every request
// apiClient.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       try {
//         const token = localStorage.getItem("token")
//         if (token && config.headers) {
//           config.headers.Authorization = `Bearer ${token}`
//         }
//       } catch (e) {
//         console.warn("Error retrieving token from localStorage:", e)
//       }
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// export default apiClient

import axios from "axios"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default apiClient
