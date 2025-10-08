import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { DailyReport } from "@/lib/models/analytics"

async function handler(req: NextRequest, payload: any) {
  try {
    const db = await getDatabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [routeStats, dataStats, alertStats, deviceStats] = await Promise.all([
      db
        .collection("routes")
        .aggregate([
          {
            $match: {
              start_time: { $gte: today, $lt: tomorrow },
              status: "concluida",
            },
          },
          {
            $group: {
              _id: null,
              total_rotas: { $sum: 1 },
              avg_eficiencia: { $avg: "$eficiencia_percentual" },
            },
          },
        ])
        .toArray(),

      db
        .collection("iot_data_logs")
        .aggregate([
          {
            $match: {
              created_at: { $gte: today, $lt: tomorrow },
            },
          },
          {
            $group: {
              _id: null,
              total_coletas: { $sum: 1 },
              total_peso_kg: { $sum: "$data.peso_kg" },
            },
          },
        ])
        .toArray(),

      db.collection("alerts").countDocuments({
        created_at: { $gte: today, $lt: tomorrow },
      }),

      db.collection("iot_devices").countDocuments({ status: "ativo" }),
    ])

    const routeData = routeStats[0] || { total_rotas: 0, avg_eficiencia: 0 }
    const dataData = dataStats[0] || { total_coletas: 0, total_peso_kg: 0 }

    const report: DailyReport = {
      date: today,
      total_peso_kg: Math.round(dataData.total_peso_kg || 0),
      total_coletas: dataData.total_coletas,
      rotas_concluidas: routeData.total_rotas,
      eficiencia_media: Math.round(routeData.avg_eficiencia || 0),
      alertas_gerados: alertStats,
      dispositivos_ativos: deviceStats,
      top_neighborhoods: [],
      created_at: new Date(),
    }

    const reportsCollection = db.collection<DailyReport>("daily_reports")
    const result = await reportsCollection.insertOne(report)

    return NextResponse.json({
      message: "Relatório gerado com sucesso",
      report: {
        id: result.insertedId,
        ...report,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao gerar relatório:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 })
  }
}

export const POST = withAuth(handler, ["admin", "prefeitura"])
