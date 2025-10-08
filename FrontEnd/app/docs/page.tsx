import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Documentação da API</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">EcoTech DataFlow API</h2>
            <p className="text-muted-foreground mb-4">
              API REST completa para monitoramento de coleta de resíduos com IoT, analytics e gamificação.
            </p>
            <Badge>v1.0.0</Badge>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Autenticação</CardTitle>
              <CardDescription>Todos os endpoints protegidos requerem token JWT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">POST /api/auth/register</p>
                <p className="text-sm text-muted-foreground mt-1">Criar nova conta</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">POST /api/auth/login</p>
                <p className="text-sm text-muted-foreground mt-1">Fazer login e obter token</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/auth/me</p>
                <p className="text-sm text-muted-foreground mt-1">Obter dados do usuário autenticado</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IoT</CardTitle>
              <CardDescription>Gerenciamento de dispositivos e ingestão de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">POST /api/iot/register</p>
                <p className="text-sm text-muted-foreground mt-1">Registrar novo dispositivo IoT</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/iot/devices</p>
                <p className="text-sm text-muted-foreground mt-1">Listar dispositivos</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">POST /api/iot/data</p>
                <p className="text-sm text-muted-foreground mt-1">Enviar dados de sensores</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoramento</CardTitle>
              <CardDescription>Rotas, alertas e estatísticas em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/monitoramento/rotas-ativas</p>
                <p className="text-sm text-muted-foreground mt-1">Listar rotas em andamento</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/monitoramento/alertas</p>
                <p className="text-sm text-muted-foreground mt-1">Listar alertas do sistema</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/monitoramento/estatisticas</p>
                <p className="text-sm text-muted-foreground mt-1">Obter estatísticas gerais</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>KPIs e relatórios automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/analytics/kpis</p>
                <p className="text-sm text-muted-foreground mt-1">Obter KPIs do sistema</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/analytics/relatorios</p>
                <p className="text-sm text-muted-foreground mt-1">Listar relatórios gerados</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">POST /api/analytics/gerar-relatorio</p>
                <p className="text-sm text-muted-foreground mt-1">Gerar novo relatório</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gamificação</CardTitle>
              <CardDescription>Sistema de pontos e rankings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">POST /api/gamificacao/pontos</p>
                <p className="text-sm text-muted-foreground mt-1">Adicionar pontos a usuário</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/gamificacao/ranking</p>
                <p className="text-sm text-muted-foreground mt-1">Obter ranking de usuários</p>
              </div>
              <div>
                <p className="font-mono text-sm bg-muted p-2 rounded">GET /api/gamificacao/meus-pontos</p>
                <p className="text-sm text-muted-foreground mt-1">Ver histórico de pontos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
