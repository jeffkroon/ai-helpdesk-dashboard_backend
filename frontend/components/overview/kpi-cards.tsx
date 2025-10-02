import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Star, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

async function getOverviewMetrics() {
  // In production, this would call your API route with comparison support
  // const res = await fetch('/api/metrics/overview?projectId=...&start=...&end=...&compare=true')
  // Backend should return both current and previous period data
  // return res.json()

  // Mock data for demonstration
  return {
    conversations: 12847,
    uniqueUsers: 8234,
    avgChatScore: 4.2,
    sentiment: { pos: 6821, neu: 4102, neg: 1924 },
    comparison: {
      conversations: { value: 11432, change: 12.4 },
      uniqueUsers: { value: 7612, change: 8.2 },
      avgChatScore: { value: 4.1, change: 2.4 },
      positiveSentiment: { value: 64.8, change: 5.1 },
    },
  }
}

export async function KPICards() {
  const metrics = await getOverviewMetrics()

  const sentimentTotal = metrics.sentiment.pos + metrics.sentiment.neu + metrics.sentiment.neg
  const positivePercent = ((metrics.sentiment.pos / sentimentTotal) * 100).toFixed(1)

  const cards = [
    {
      title: "Total Conversations",
      value: metrics.conversations.toLocaleString(),
      icon: MessageSquare,
      description: "Transcripts in period",
      change: metrics.comparison.conversations.change,
    },
    {
      title: "Unique Users",
      value: metrics.uniqueUsers.toLocaleString(),
      icon: Users,
      description: "Active users",
      change: metrics.comparison.uniqueUsers.change,
    },
    {
      title: "Avg Chat Score",
      value: metrics.avgChatScore ? metrics.avgChatScore.toFixed(1) : "N/A",
      icon: Star,
      description: "Out of 5.0",
      change: metrics.comparison.avgChatScore.change,
    },
    {
      title: "Positive Sentiment",
      value: `${positivePercent}%`,
      icon: TrendingUp,
      description: `${metrics.sentiment.pos.toLocaleString()} positive`,
      change: metrics.comparison.positiveSentiment.change,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const isPositive = card.change > 0
        const isNegative = card.change < 0
        const TrendIcon = isPositive ? ArrowUp : ArrowDown

        return (
          <Card key={card.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{card.description}</p>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    isPositive && "text-green-500",
                    isNegative && "text-red-500",
                    !isPositive && !isNegative && "text-muted-foreground",
                  )}
                  aria-label={`Trend: ${isPositive ? "up" : isNegative ? "down" : "unchanged"} ${Math.abs(card.change)}%`}
                >
                  {(isPositive || isNegative) && <TrendIcon className="h-3 w-3" aria-hidden="true" />}
                  {isPositive ? "+" : ""}
                  {card.change.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
