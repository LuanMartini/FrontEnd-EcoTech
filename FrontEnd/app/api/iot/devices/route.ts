import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { withAuth } from "@/lib/middleware/auth"
import type { IoTDevice } from "@/lib/models/iot-device"

async function handler(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const device_type = searchParams.get("device_type")

    const db = await getDatabase()
    const devicesCollection = db.collection<IoTDevice>("iot_devices")

    const filter: any = {}
    if (status) filter.status = status
    if (device_type) filter.device_type = device_type

    const devices = await devicesCollection.find(filter).sort({ created_at: -1 }).limit(100).toArray()

    return NextResponse.json({
      devices,
      total: devices.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao listar dispositivos:", error)
    return NextResponse.json({ error: "Erro ao listar dispositivos" }, { status: 500 })
  }
}

export const GET = withAuth(handler, ["admin", "prefeitura"])
