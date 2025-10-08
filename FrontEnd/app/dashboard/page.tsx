"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Recycle } from "lucide-react"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { AlertsList } from "@/components/dashboard/alerts-list"
import { ActiveRoutes } from "@/components/dashboard/active-routes"
import { RankingTable } from "@/components/dashboard/ranking-table"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">EcoTech DataFlow</h1>
          </div>
          <Badge variant="outline">Dashboard Administrativo</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard de Monitoramento</h2>
          <p className="text-muted-foreground">Visão geral do sistema de coleta de resíduos</p>
        </div>

        <KPICards />

        <Tabs defaultValue="rotas" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rotas">Rotas Ativas</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="rotas" className="mt-6">
            <ActiveRoutes />
          </TabsContent>

          <TabsContent value="alertas" className="mt-6">
            <AlertsList />
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <RankingTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
