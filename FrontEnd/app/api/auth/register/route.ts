import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth/password"
import { generateToken } from "@/lib/auth/jwt"
import type { User } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, role, cpf, phone, address } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, senha e nome são obrigatórios" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }

    const password_hash = await hashPassword(password)

    const newUser: User = {
      email,
      password_hash,
      name,
      role: role || "cidadao",
      cpf,
      phone,
      address,
      points: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)

    const token = generateToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
      role: newUser.role,
    })

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          id: result.insertedId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          points: newUser.points,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao registrar usuário:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
