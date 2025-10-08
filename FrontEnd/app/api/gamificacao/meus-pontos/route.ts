import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"

async function handler(req: NextRequest, payload: any) {
  try {
    const db = await getDatabase()
    const pointsCollection = db.collection("user_points")

    const userPoints = await pointsCollection
      .find({ user_id: payload.userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    const totalPoints = await pointsCollection
      .aggregate([
        {
          $match: { user_id: payload.userId },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$points_earned" },
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      points: userPoints,
      total_points: totalPoints[0]?.total || 0,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar pontos do usuário:", error)
    return NextResponse.json({ error: "Erro ao buscar pontos" }, { status: 500 })
  }
}

export const GET = withAuth(handler)
