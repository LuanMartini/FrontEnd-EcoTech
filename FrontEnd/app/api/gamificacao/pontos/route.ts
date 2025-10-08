import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import { ObjectId } from "mongodb"
import type { User, UserPoints } from "@/lib/models/user"

async function handler(req: NextRequest, payload: any) {
  try {
    const body = await req.json()
    const { user_id, points_earned, reason, device_id, peso_kg } = body

    if (!user_id || !points_earned || !reason) {
      return NextResponse.json({ error: "user_id, points_earned e reason são obrigatórios" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")
    const pointsCollection = db.collection<UserPoints>("user_points")

    const pointsRecord: UserPoints = {
      user_id,
      points_earned,
      reason,
      device_id,
      peso_kg,
      timestamp: new Date(),
    }

    await pointsCollection.insertOne(pointsRecord)

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $inc: { points: points_earned },
        $set: { updated_at: new Date() },
      },
      { returnDocument: "after", projection: { password_hash: 0 } },
    )

    if (!result) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Pontos adicionados com sucesso",
      user: result,
      points_added: points_earned,
    })
  } catch (error) {
    console.error("[v0] Erro ao adicionar pontos:", error)
    return NextResponse.json({ error: "Erro ao adicionar pontos" }, { status: 500 })
  }
}

export const POST = withAuth(handler, ["admin", "prefeitura"])
