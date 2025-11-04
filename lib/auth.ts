import jwt from "jsonwebtoken"

interface TokenPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

export function verifyToken(token: string): TokenPayload {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }


    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid or expired token")
    }
    throw error
  }
}

export function extractTokenFromHeader(authHeader: string | null): string {
  if (!authHeader) {
    throw new Error("Authorization header is missing")
  }

  const parts = authHeader.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error("Invalid authorization header format. Expected: Bearer <token>")
  }

  return parts[1]
}
