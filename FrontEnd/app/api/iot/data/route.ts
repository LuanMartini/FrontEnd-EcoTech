import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { IoTDataLog, IoTDevice } from "@/lib/models/iot-device"
import type { Alert } from "@/lib/models/alert"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { device_id, data } = body

    if (!device_id || !data) {
      return NextResponse.json({ error: "device_id e data são obrigatórios" }, { status: 400 })
    }

    const db = await getDatabase()
    const devicesCollection = db.collection<IoTDevice>("iot_devices")
    const logsCollection = db.collection<IoTDataLog>("iot_data_logs")
    const alertsCollection = db.collection<Alert>("alerts")

    const device = await devicesCollection.findOne({ device_id })
    if (!device) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 })
    }

    const dataLog: IoTDataLog = {
      device_id,
      timestamp: new Date(),
      data,
      processed: false,
      created_at: new Date(),
    }

    const result = await logsCollection.insertOne(dataLog)

    await devicesCollection.updateOne(
      { device_id },
      { $set: { last_communication: new Date(), updated_at: new Date() } },
    )

    if (device.device_type === "sensor_ultrasonico" && data.nivel_enchimento >= 80) {
      await alertsCollection.insertOne({
        alert_type: "lixeira_cheia",
        severity: data.nivel_enchimento >= 95 ? "critica" : "alta",
        device_id,
        message: `Lixeira com ${data.nivel_enchimento}% de capacidade`,
        details: { nivel_enchimento: data.nivel_enchimento, location: device.location },
        status: "aberto",
        created_at: new Date(),
      })
    }

    if (device.device_type === "sensor_peso" && data.peso_kg > 1000) {
      await alertsCollection.insertOne({
        alert_type: "anomalia_dados",
        severity: "media",
        device_id,
        message: `Peso anormal detectado: ${data.peso_kg}kg`,
        details: { peso_kg: data.peso_kg, location: device.location },
        status: "aberto",
        created_at: new Date(),
      })
    }

    return NextResponse.json(
      {
        message: "Dados recebidos com sucesso",
        log_id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao processar dados IoT:", error)
    return NextResponse.json({ error: "Erro ao processar dados" }, { status: 500 })
  }
}
