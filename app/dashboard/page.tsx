import { Suspense } from "react"
import { KPICards } from "@/components/overview/kpi-cards"
import { InteractionsChart } from "@/components/overview/interactions-chart"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-muted-foreground mt-1">Key metrics and insights for your chatbot performance</p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <KPICards />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
        <InteractionsChart />
      </Suspense>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}
