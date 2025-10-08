import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, TrendingUp, MapPin, Bell } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-emerald-900">EcoTech DataFlow</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-emerald-900 mb-4 text-balance">
            Monitoramento Inteligente de Coleta de Resíduos
          </h2>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto text-pretty">
            Integração completa entre prefeitura, coleta e reciclagem com IoT, rastreamento GPS e analytics em tempo
            real
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle>Rastreamento GPS</CardTitle>
              <CardDescription>Monitore caminhões e rotas em tempo real</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle>Analytics Avançado</CardTitle>
              <CardDescription>KPIs e relatórios automáticos</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle>Alertas Inteligentes</CardTitle>
              <CardDescription>Notificações de lixeiras cheias e anomalias</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Recycle className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle>Gamificação</CardTitle>
              <CardDescription>Sistema de pontos e rankings</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">Recursos Principais</h3>
          <ul className="space-y-3 text-emerald-800">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Sensores IoT para peso, nível de enchimento e temperatura</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Rastreamento GPS de caminhões e rotas de coleta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Dashboard analítico com KPIs e métricas de eficiência</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Sistema de alertas automáticos para lixeiras cheias</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Gamificação com pontos e rankings por bairro</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Relatórios automáticos diários, semanais e mensais</span>
            </li>
          </ul>

          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Acessar Dashboard
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                Documentação da API
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-emerald-700">
          <p>EcoTech DataFlow - Monitoramento Inteligente de Resíduos</p>
        </div>
      </footer>
    </div>
  )
}
