"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RankingTable() {
  const { data, error, isLoading } = useSWR("/api/gamificacao/ranking?period=mensal&limit=10", fetcher, {
    refreshInterval: 60000,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking Mensal</CardTitle>
          <CardDescription>Carregando ranking...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking Mensal</CardTitle>
          <CardDescription className="text-destructive">Erro ao carregar ranking</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (position === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-muted-foreground font-medium">{position}</span>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking Mensal</CardTitle>
        <CardDescription>Top 10 usuários com mais pontos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.ranking?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum dado de ranking disponível</p>
            </div>
          ) : (
            data?.ranking?.map((item: any) => (
              <div key={item.user_id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">{getPositionIcon(item.position)}</div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.neighborhood || "Sem bairro"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{item.total_points} pts</p>
                  <p className="text-sm text-muted-foreground">{Math.round(item.total_peso_kg || 0)} kg</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
