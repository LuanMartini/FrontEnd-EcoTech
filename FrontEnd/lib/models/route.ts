import type { ObjectId } from "mongodb"

export interface Route {
  _id?: ObjectId
  route_id: string
  vehicle_id: string
  driver_name: string
  status: "planejada" | "em_andamento" | "concluida" | "cancelada"
  start_time: Date
  end_time?: Date
  waypoints: Array<{
    latitude: number
    longitude: number
    address: string
    visited: boolean
    visited_at?: Date
    peso_coletado_kg?: number
  }>
  total_peso_kg: number
  eficiencia_percentual?: number
  created_at: Date
  updated_at: Date
}
