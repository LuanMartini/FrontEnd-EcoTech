import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { IoTDevice } from "@/lib/models/iot-device"

async function getHandler(req: NextRequest, payload: any, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const devicesCollection = db.collection<IoTDevice>("iot_devices")

    const device = await devicesCollection.findOne({ device_id: params.id })

    if (!device) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ device })
  } catch (error) {
    console.error("[v0] Erro ao buscar dispositivo:", error)
    return NextResponse.json({ error: "Erro ao buscar dispositivo" }, { status: 500 })
  }
}

async function patchHandler(req: NextRequest, payload: any, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status, location, metadata } = body

    const db = await getDatabase()
    const devicesCollection = db.collection<IoTDevice>("iot_devices")

    const updateData: Partial<IoTDevice> = {
      updated_at: new Date(),
    }

    if (status) updateData.status = status
    if (location) updateData.location = location
    if (metadata) updateData.metadata = metadata

    const result = await devicesCollection.findOneAndUpdate(
      { device_id: params.id },
      { $set: updateData },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Dispositivo atualizado com sucesso",
      device: result,
    })
  } catch (error) {
    console.error("[v0] Erro ao atualizar dispositivo:", error)
    return NextResponse.json({ error: "Erro ao atualizar dispositivo" }, { status: 500 })
  }
}

export const GET = (req: NextRequest, context: any) =>
  withAuth((r: NextRequest, p: any) => getHandler(r, p, context), ["admin", "prefeitura"])(req)
export const PATCH = (req: NextRequest, context: any) =>
  withAuth((r: NextRequest, p: any) => patchHandler(r, p, context), ["admin", "prefeitura"])(req)
