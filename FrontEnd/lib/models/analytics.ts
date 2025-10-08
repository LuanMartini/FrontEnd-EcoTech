import type { ObjectId } from "mongodb"

export interface DailyReport {
  _id?: ObjectId
  date: Date
  total_peso_kg: number
  total_coletas: number
  rotas_concluidas: number
  eficiencia_media: number
  alertas_gerados: number
  dispositivos_ativos: number
  top_neighborhoods: Array<{
    neighborhood: string
    peso_kg: number
    coletas: number
  }>
  created_at: Date
}

export interface MonthlyReport {
  _id?: ObjectId
  month: number
  year: number
  total_peso_kg: number
  total_coletas: number
  rotas_concluidas: number
  eficiencia_media: number
  taxa_reciclagem: number
  custo_estimado: number
  economia_gerada: number
  top_neighborhoods: Array<{
    neighborhood: string
    peso_kg: number
    coletas: number
  }>
  created_at: Date
}
