import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import { ObjectId } from "mongodb"
import type { Alert } from "@/lib/models/alert"

async function handler(req: NextRequest, payload: any, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const alertsCollection = db.collection<Alert>("alerts")

    const result = await alertsCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: "resolvido",
          resolved_at: new Date(),
          resolved_by: payload.userId,
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Alerta não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Alerta resolvido com sucesso",
      alert: result,
    })
  } catch (error) {
    console.error("[v0] Erro ao resolver alerta:", error)
    return NextResponse.json({ error: "Erro ao resolver alerta" }, { status: 500 })
  }
}

export const POST = (req: NextRequest, context: any) =>
  withAuth((r: NextRequest, p: any) => handler(r, p, context), ["admin", "prefeitura"])(req)
