import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password_hash: string
  name: string
  role: "admin" | "prefeitura" | "motorista" | "cidadao"
  cpf?: string
  phone?: string
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipcode: string
  }
  points: number
  created_at: Date
  updated_at: Date
}

export interface UserPoints {
  _id?: ObjectId
  user_id: string
  points_earned: number
  reason: string
  device_id?: string
  peso_kg?: number
  timestamp: Date
}

export interface Ranking {
  _id?: ObjectId
  period: "diario" | "semanal" | "mensal"
  period_start: Date
  period_end: Date
  rankings: Array<{
    user_id: string
    name: string
    neighborhood: string
    total_points: number
    total_peso_kg: number
    position: number
  }>
  created_at: Date
}
