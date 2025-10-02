import { Suspense } from "react"
import { SentimentChart } from "@/components/sentiment/sentiment-chart"
import { ScoresHistogram } from "@/components/sentiment/scores-histogram"
import { LowScoreTranscripts } from "@/components/sentiment/low-score-transcripts"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function SentimentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Sentiment & Scores</h2>
        <p className="text-muted-foreground mt-1">User satisfaction and sentiment analysis</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
          <SentimentChart />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
          <ScoresHistogram />
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
        <LowScoreTranscripts />
      </Suspense>
    </div>
  )
}
