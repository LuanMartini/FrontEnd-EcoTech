import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"

async function handler(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "mensal"
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const db = await getDatabase()

    const startDate = new Date()
    if (period === "diario") {
      startDate.setHours(0, 0, 0, 0)
    } else if (period === "semanal") {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === "mensal") {
      startDate.setMonth(startDate.getMonth() - 1)
    }

    const ranking = await db
      .collection("user_points")
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$user_id",
            total_points: { $sum: "$points_earned" },
            total_peso_kg: { $sum: "$peso_kg" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            user_id: "$_id",
            name: "$user.name",
            neighborhood: "$user.address.neighborhood",
            total_points: 1,
            total_peso_kg: 1,
          },
        },
        {
          $sort: { total_points: -1 },
        },
        {
          $limit: limit,
        },
      ])
      .toArray()

    const rankingWithPosition = ranking.map((item, index) => ({
      ...item,
      position: index + 1,
    }))

    return NextResponse.json({
      period,
      ranking: rankingWithPosition,
      total: rankingWithPosition.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar ranking:", error)
    return NextResponse.json({ error: "Erro ao buscar ranking" }, { status: 500 })
  }
}

export const GET = withAuth(handler)
