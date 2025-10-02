import { Suspense } from "react"
import { PeaksChart } from "@/components/peaks/peaks-chart"
import { PeaksHeatmap } from "@/components/peaks/peaks-heatmap"
import { PeaksTable } from "@/components/peaks/peaks-table"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function PeaksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Usage Peaks</h2>
        <p className="text-muted-foreground mt-1">Identify high-traffic periods and usage patterns</p>
      </div>

      <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
        <PeaksChart />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<LoadingSkeleton className="h-[300px]" />}>
          <PeaksHeatmap />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton className="h-[300px]" />}>
          <PeaksTable />
        </Suspense>
      </div>
    </div>
  )
}
