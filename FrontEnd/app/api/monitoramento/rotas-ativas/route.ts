import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { Route } from "@/lib/models/route"

async function handler(req: NextRequest, payload: any) {
  try {
    const db = await getDatabase()
    const routesCollection = db.collection<Route>("routes")

    const activeRoutes = await routesCollection
      .find({
        status: { $in: ["planejada", "em_andamento"] },
      })
      .sort({ start_time: -1 })
      .toArray()

    const routesWithProgress = activeRoutes.map((route) => {
      const totalWaypoints = route.waypoints.length
      const visitedWaypoints = route.waypoints.filter((w) => w.visited).length
      const progress = totalWaypoints > 0 ? (visitedWaypoints / totalWaypoints) * 100 : 0

      return {
        ...route,
        progress,
        visited_waypoints: visitedWaypoints,
        total_waypoints: totalWaypoints,
      }
    })

    return NextResponse.json({
      routes: routesWithProgress,
      total: routesWithProgress.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar rotas ativas:", error)
    return NextResponse.json({ error: "Erro ao buscar rotas ativas" }, { status: 500 })
  }
}

export const GET = withAuth(handler, ["admin", "prefeitura", "motorista"])
