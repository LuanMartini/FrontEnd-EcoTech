import mqtt from "mqtt"
import { getDatabase } from "@/lib/mongodb"
import type { IoTDataLog } from "@/lib/models/iot-device"

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883"
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

let client: mqtt.MqttClient | null = null

export function initMQTTClient() {
  if (client) {
    return client
  }

  const options: mqtt.IClientOptions = {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    reconnectPeriod: 5000,
  }

  client = mqtt.connect(MQTT_BROKER_URL, options)

  client.on("connect", () => {
    console.log("[v0] MQTT Client conectado ao broker")

    client?.subscribe("ecotech/sensors/#", (err) => {
      if (err) {
        console.error("[v0] Erro ao se inscrever no tópico:", err)
      } else {
        console.log("[v0] Inscrito no tópico: ecotech/sensors/#")
      }
    })
  })

  client.on("message", async (topic, message) => {
    try {
      const data = JSON.parse(message.toString())
      console.log("[v0] Mensagem MQTT recebida:", topic, data)

      const device_id = topic.split("/")[2]

      const db = await getDatabase()
      const logsCollection = db.collection<IoTDataLog>("iot_data_logs")

      const dataLog: IoTDataLog = {
        device_id,
        timestamp: new Date(),
        data,
        processed: false,
        created_at: new Date(),
      }

      await logsCollection.insertOne(dataLog)
      console.log("[v0] Dados MQTT salvos no banco")
    } catch (error) {
      console.error("[v0] Erro ao processar mensagem MQTT:", error)
    }
  })

  client.on("error", (error) => {
    console.error("[v0] Erro no cliente MQTT:", error)
  })

  return client
}

export function publishToMQTT(topic: string, message: any) {
  if (!client) {
    console.error("[v0] Cliente MQTT não inicializado")
    return
  }

  client.publish(topic, JSON.stringify(message), (err) => {
    if (err) {
      console.error("[v0] Erro ao publicar mensagem MQTT:", err)
    }
  })
}
