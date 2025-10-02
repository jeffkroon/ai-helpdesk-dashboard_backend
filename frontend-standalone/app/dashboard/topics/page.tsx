import { Suspense } from "react"
import { TopIntentsChart } from "@/components/topics/top-intents-chart"
import { TopQuestionsTable } from "@/components/topics/top-questions-table"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TopicsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Topics</h2>
        <p className="text-muted-foreground mt-1">Most common intents and user questions</p>
      </div>

      <Tabs defaultValue="intents" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="intents">Top Intents</TabsTrigger>
          <TabsTrigger value="questions">
            Top Questions
            <span className="ml-2 rounded-full bg-chart-1/20 px-2 py-0.5 text-xs text-chart-1">Beta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intents" className="space-y-6">
          <Suspense fallback={<LoadingSkeleton className="h-[500px]" />}>
            <TopIntentsChart />
          </Suspense>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Suspense fallback={<LoadingSkeleton className="h-[500px]" />}>
            <TopQuestionsTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
