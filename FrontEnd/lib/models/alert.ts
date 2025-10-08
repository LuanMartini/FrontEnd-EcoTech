import type { ObjectId } from "mongodb"

export interface Alert {
  _id?: ObjectId
  alert_type: "lixeira_cheia" | "sensor_offline" | "rota_atrasada" | "anomalia_dados"
  severity: "baixa" | "media" | "alta" | "critica"
  device_id?: string
  route_id?: string
  message: string
  details: {
    [key: string]: any
  }
  status: "aberto" | "em_analise" | "resolvido" | "ignorado"
  created_at: Date
  resolved_at?: Date
  resolved_by?: string
}
