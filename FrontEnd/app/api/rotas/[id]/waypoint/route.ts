import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { Route } from "@/lib/models/route"

async function handler(req: NextRequest, payload: any, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { waypoint_index, peso_coletado_kg } = body

    const db = await getDatabase()
    const routesCollection = db.collection<Route>("routes")

    const route = await routesCollection.findOne({ route_id: params.id })

    if (!route) {
      return NextResponse.json({ error: "Rota não encontrada" }, { status: 404 })
    }

    if (waypoint_index < 0 || waypoint_index >= route.waypoints.length) {
      return NextResponse.json({ error: "Índice de waypoint inválido" }, { status: 400 })
    }

    route.waypoints[waypoint_index].visited = true
    route.waypoints[waypoint_index].visited_at = new Date()
    route.waypoints[waypoint_index].peso_coletado_kg = peso_coletado_kg

    const total_peso_kg = route.waypoints.reduce((sum, w) => sum + (w.peso_coletado_kg || 0), 0)

    const allVisited = route.waypoints.every((w) => w.visited)
    const newStatus = allVisited ? "concluida" : "em_andamento"

    const result = await routesCollection.findOneAndUpdate(
      { route_id: params.id },
      {
        $set: {
          waypoints: route.waypoints,
          total_peso_kg,
          status: newStatus,
          end_time: allVisited ? new Date() : undefined,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return NextResponse.json({
      message: "Waypoint atualizado com sucesso",
      route: result,
    })
  } catch (error) {
    console.error("[v0] Erro ao atualizar waypoint:", error)
    return NextResponse.json({ error: "Erro ao atualizar waypoint" }, { status: 500 })
  }
}

export const POST = (req: NextRequest, context: any) =>
  withAuth((r: NextRequest, p: any) => handler(r, p, context), ["admin", "prefeitura", "motorista"])(req)
