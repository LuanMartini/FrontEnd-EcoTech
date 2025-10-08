import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"

async function handler(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "today"

    const db = await getDatabase()

    const startDate = new Date()
    if (period === "today") {
      startDate.setHours(0, 0, 0, 0)
    } else if (period === "week") {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === "month") {
      startDate.setMonth(startDate.getMonth() - 1)
    }

    const [routeStats, dataStats, deviceStats] = await Promise.all([
      db
        .collection("routes")
        .aggregate([
          {
            $match: {
              start_time: { $gte: startDate },
              status: "concluida",
            },
          },
          {
            $group: {
              _id: null,
              total_rotas: { $sum: 1 },
              total_peso_kg: { $sum: "$total_peso_kg" },
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
              created_at: { $gte: startDate },
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

      db.collection("iot_devices").countDocuments({ status: "ativo" }),
    ])

    const routeData = routeStats[0] || { total_rotas: 0, total_peso_kg: 0, avg_eficiencia: 0 }
    const dataData = dataStats[0] || { total_coletas: 0, total_peso_kg: 0 }

    const totalPeso = routeData.total_peso_kg + dataData.total_peso_kg
    const taxaReciclagem = totalPeso > 0 ? (dataData.total_peso_kg / totalPeso) * 100 : 0

    return NextResponse.json({
      period,
      kpis: {
        eficiencia_coleta: Math.round(routeData.avg_eficiencia || 0),
        volume_total_kg: Math.round(totalPeso),
        taxa_reciclagem: Math.round(taxaReciclagem),
        tempo_medio_rota: 45,
        rotas_concluidas: routeData.total_rotas,
        total_coletas: dataData.total_coletas,
        dispositivos_ativos: deviceStats,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar KPIs:", error)
    return NextResponse.json({ error: "Erro ao buscar KPIs" }, { status: 500 })
  }
}

export const GET = withAuth(handler, ["admin", "prefeitura"])
