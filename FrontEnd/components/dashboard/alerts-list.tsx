"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AlertsList() {
  const { data, error, isLoading, mutate } = useSWR("/api/monitoramento/alertas?status=aberto", fetcher, {
    refreshInterval: 15000,
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critica":
        return "destructive"
      case "alta":
        return "destructive"
      case "media":
        return "default"
      case "baixa":
        return "secondary"
      default:
        return "default"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas Ativos</CardTitle>
          <CardDescription>Carregando alertas...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas Ativos</CardTitle>
          <CardDescription className="text-destructive">Erro ao carregar alertas</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas Ativos</CardTitle>
        <CardDescription>
          {data?.total || 0} alertas abertos - {data?.stats?.critica || 0} críticos, {data?.stats?.alta || 0} altos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.alerts?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>Nenhum alerta ativo no momento</p>
            </div>
          ) : (
            data?.alerts?.map((alert: any) => (
              <div key={alert._id} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      <span className="text-sm text-muted-foreground">{alert.alert_type}</span>
                    </div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(alert.created_at), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Resolver
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
