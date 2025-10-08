import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"

export function withAuth(handler: Function, allowedRoles?: string[]) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 })
    }

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    return handler(req, payload)
  }
}
