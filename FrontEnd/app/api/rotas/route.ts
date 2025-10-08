import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { Route } from "@/lib/models/route"

async function getHandler(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const db = await getDatabase()
    const routesCollection = db.collection<Route>("routes")

    const filter: any = {}
    if (status) filter.status = status

    const routes = await routesCollection.find(filter).sort({ start_time: -1 }).limit(limit).toArray()

    return NextResponse.json({
      routes,
      total: routes.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar rotas:", error)
    return NextResponse.json({ error: "Erro ao buscar rotas" }, { status: 500 })
  }
}

async function postHandler(req: NextRequest, payload: any) {
  try {
    const body = await req.json()
    const { route_id, vehicle_id, driver_name, waypoints } = body

    if (!route_id || !vehicle_id || !driver_name || !waypoints) {
      return NextResponse.json({ error: "Dados obrigatórios faltando" }, { status: 400 })
    }

    const db = await getDatabase()
    const routesCollection = db.collection<Route>("routes")

    const newRoute: Route = {
      route_id,
      vehicle_id,
      driver_name,
      status: "planejada",
      start_time: new Date(),
      waypoints: waypoints.map((w: any) => ({
        ...w,
        visited: false,
      })),
      total_peso_kg: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await routesCollection.insertOne(newRoute)

    return NextResponse.json(
      {
        message: "Rota criada com sucesso",
        route: {
          id: result.insertedId,
          ...newRoute,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao criar rota:", error)
    return NextResponse.json({ error: "Erro ao criar rota" }, { status: 500 })
  }
}

export const GET = withAuth(getHandler, ["admin", "prefeitura", "motorista"])
export const POST = withAuth(postHandler, ["admin", "prefeitura"])
