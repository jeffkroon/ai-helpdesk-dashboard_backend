import { Suspense } from "react"
import { TranscriptsTable } from "@/components/transcripts/transcripts-table"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function TranscriptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Transcripts</h2>
        <p className="text-muted-foreground mt-1">Browse and analyze individual conversations</p>
      </div>

      <Suspense fallback={<LoadingSkeleton className="h-[600px]" />}>
        <TranscriptsTable />
      </Suspense>
    </div>
  )
}
