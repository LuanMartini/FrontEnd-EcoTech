import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { IoTDevice } from "@/lib/models/iot-device"

async function handler(req: NextRequest, payload: any) {
  try {
    const body = await req.json()
    const { device_id, device_type, location, metadata } = body

    if (!device_id || !device_type || !location) {
      return NextResponse.json({ error: "device_id, device_type e location são obrigatórios" }, { status: 400 })
    }

    const db = await getDatabase()
    const devicesCollection = db.collection<IoTDevice>("iot_devices")

    const existingDevice = await devicesCollection.findOne({ device_id })
    if (existingDevice) {
      return NextResponse.json({ error: "Dispositivo já registrado" }, { status: 409 })
    }

    const newDevice: IoTDevice = {
      device_id,
      device_type,
      location,
      status: "ativo",
      last_communication: new Date(),
      metadata: metadata || {},
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await devicesCollection.insertOne(newDevice)

    return NextResponse.json(
      {
        message: "Dispositivo registrado com sucesso",
        device: {
          id: result.insertedId,
          ...newDevice,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao registrar dispositivo:", error)
    return NextResponse.json({ error: "Erro ao registrar dispositivo" }, { status: 500 })
  }
}

export const POST = withAuth(handler, ["admin", "prefeitura"])
