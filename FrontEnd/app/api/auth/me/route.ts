import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import { ObjectId } from "mongodb"
import type { User } from "@/lib/models/user"

async function handler(req: NextRequest, payload: any) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const user = await usersCollection.findOne(
      { _id: new ObjectId(payload.userId) },
      { projection: { password_hash: 0 } },
    )

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Erro ao buscar usuário:", error)
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}

export const GET = withAuth(handler)
