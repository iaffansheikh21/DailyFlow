"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  userId?: string
  name?: string
  email?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1]))
          setUser({
            userId: payload.userId,
            email: payload.email,
            name: payload.name,
          })
        } catch (err) {
          console.error("Failed to decode token:", err)
          localStorage.removeItem("token")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    try {
      const payload = JSON.parse(atob(newToken.split(".")[1]))
      setUser({
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
      })
    } catch (err) {
      console.error("Failed to decode token:", err)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
