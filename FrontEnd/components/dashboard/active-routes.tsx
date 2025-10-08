"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Truck } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ActiveRoutes() {
  const { data, error, isLoading } = useSWR("/api/monitoramento/rotas-ativas", fetcher, {
    refreshInterval: 10000,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rotas Ativas</CardTitle>
          <CardDescription>Carregando rotas...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rotas Ativas</CardTitle>
          <CardDescription className="text-destructive">Erro ao carregar rotas</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rotas Ativas</CardTitle>
        <CardDescription>{data?.total || 0} rotas em andamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data?.routes?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-2" />
              <p>Nenhuma rota ativa no momento</p>
            </div>
          ) : (
            data?.routes?.map((route: any) => (
              <div key={route._id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{route.route_id}</p>
                      <p className="text-sm text-muted-foreground">{route.driver_name}</p>
                    </div>
                  </div>
                  <Badge variant={route.status === "em_andamento" ? "default" : "secondary"}>{route.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">
                      {route.visited_waypoints}/{route.total_waypoints} pontos
                    </span>
                  </div>
                  <Progress value={route.progress} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Peso coletado</span>
                  <span className="font-medium">{route.total_peso_kg} kg</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
