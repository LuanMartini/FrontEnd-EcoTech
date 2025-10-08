import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"

async function handler(req: NextRequest, payload: any) {
  try {
    const db = await getDatabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [deviceStats, routeStats, alertStats, dataStats] = await Promise.all([
      db.collection("iot_devices").countDocuments({ status: "ativo" }),

      db
        .collection("routes")
        .aggregate([
          {
            $match: {
              start_time: { $gte: today },
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              total_peso: { $sum: "$total_peso_kg" },
            },
          },
        ])
        .toArray(),

      db.collection("alerts").countDocuments({ status: "aberto" }),

      db
        .collection("iot_data_logs")
        .aggregate([
          {
            $match: {
              created_at: { $gte: today },
            },
          },
          {
            $group: {
              _id: null,
              total_logs: { $sum: 1 },
              avg_peso: { $avg: "$data.peso_kg" },
              total_peso: { $sum: "$data.peso_kg" },
            },
          },
        ])
        .toArray(),
    ])

    const routesByStatus = routeStats.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count
        acc.total_peso += curr.total_peso || 0
        return acc
      },
      { planejada: 0, em_andamento: 0, concluida: 0, cancelada: 0, total_peso: 0 },
    )

    return NextResponse.json({
      dispositivos_ativos: deviceStats,
      rotas: routesByStatus,
      alertas_abertos: alertStats,
      coleta_hoje: {
        total_logs: dataStats[0]?.total_logs || 0,
        peso_medio_kg: Math.round(dataStats[0]?.avg_peso || 0),
        peso_total_kg: Math.round(dataStats[0]?.total_peso || 0),
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar estatísticas:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}

export const GET = withAuth(handler, ["admin", "prefeitura"])
