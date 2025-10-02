import { Suspense } from "react"
import { ContentGaps } from "@/components/recommendations/content-gaps"
import { FAQSuggestions } from "@/components/recommendations/faq-suggestions"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Recommendations</h2>
        <p className="text-muted-foreground mt-1">Actionable insights to improve your chatbot</p>
      </div>

      <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
        <ContentGaps />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton className="h-[400px]" />}>
        <FAQSuggestions />
      </Suspense>
    </div>
  )
}
