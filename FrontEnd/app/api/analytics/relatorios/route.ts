import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { DailyReport } from "@/lib/models/analytics"

async function handler(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "daily"
    const limit = Number.parseInt(searchParams.get("limit") || "30")

    const db = await getDatabase()
    const reportsCollection = db.collection<DailyReport>("daily_reports")

    const reports = await reportsCollection.find({}).sort({ date: -1 }).limit(limit).toArray()

    return NextResponse.json({
      reports,
      total: reports.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar relatórios:", error)
    return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 })
  }
}

export const GET = withAuth(handler, ["admin", "prefeitura"])
