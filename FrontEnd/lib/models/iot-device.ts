import type { ObjectId } from "mongodb"

export interface IoTDevice {
  _id?: ObjectId
  device_id: string
  device_type: "sensor_peso" | "sensor_ultrasonico" | "gps" | "sensor_temperatura"
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  status: "ativo" | "inativo" | "manutencao"
  last_communication: Date
  metadata: {
    modelo?: string
    fabricante?: string
    versao_firmware?: string
  }
  created_at: Date
  updated_at: Date
}

export interface IoTDataLog {
  _id?: ObjectId
  device_id: string
  timestamp: Date
  data: {
    peso_kg?: number
    nivel_enchimento?: number
    temperatura?: number
    latitude?: number
    longitude?: number
    velocidade?: number
    [key: string]: any
  }
  processed: boolean
  created_at: Date
}
