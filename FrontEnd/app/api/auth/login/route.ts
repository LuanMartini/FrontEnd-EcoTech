import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword } from "@/lib/auth/password"
import { generateToken } from "@/lib/auth/jwt"
import type { User } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
      },
      token,
    })
  } catch (error) {
    console.error("[v0] Erro ao fazer login:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
