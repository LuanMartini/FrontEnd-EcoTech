import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { Alert } from "@/lib/models/alert"

async function handler(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const db = await getDatabase()
    const alertsCollection = db.collection<Alert>("alerts")

    const filter: any = {}
    if (status) filter.status = status
    if (severity) filter.severity = severity

    const alerts = await alertsCollection.find(filter).sort({ created_at: -1 }).limit(limit).toArray()

    const stats = await alertsCollection
      .aggregate([
        { $match: { status: "aberto" } },
        {
          $group: {
            _id: "$severity",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      alerts,
      total: alerts.length,
      stats: {
        critica: stats.find((s) => s._id === "critica")?.count || 0,
        alta: stats.find((s) => s._id === "alta")?.count || 0,
        media: stats.find((s) => s._id === "media")?.count || 0,
        baixa: stats.find((s) => s._id === "baixa")?.count || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar alertas:", error)
    return NextResponse.json({ error: "Erro ao buscar alertas" }, { status: 500 })
  }
}

export const GET = withAuth(handler, ["admin", "prefeitura"])
