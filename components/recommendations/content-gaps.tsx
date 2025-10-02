import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus, Lightbulb } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

const gaps = [
  {
    topic: "Advanced API Authentication",
    rationale:
      "High volume (847 mentions), low KB coverage (12%). Users frequently ask about OAuth and JWT implementation.",
  },
  {
    topic: "Webhook Configuration",
    rationale: "Growing trend (+45% this month), no dedicated documentation. 234 support tickets opened.",
  },
  {
    topic: "Bulk Data Import",
    rationale: "Mentioned in 156 conversations, current docs only cover single-item import.",
  },
  {
    topic: "Mobile SDK Setup",
    rationale: "High abandonment rate (68%) when users reach this topic. Needs step-by-step guide.",
  },
]

export function ContentGaps() {
  if (gaps.length === 0) {
    return (
      <EmptyState
        icon={Lightbulb}
        title="No Content Gaps Detected"
        description="Great news! Your knowledge base appears to cover all frequently asked topics. We'll continue monitoring conversations for new content opportunities."
        actionLabel="View Analytics Settings"
        actionHref="/dashboard/settings"
      />
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Content Gaps</CardTitle>
        <CardDescription className="text-muted-foreground">
          Topics that need better documentation or knowledge base coverage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {gaps.map((gap, i) => (
          <div key={i} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-chart-2" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">{gap.topic}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{gap.rationale}</p>
              </div>
              <Button size="sm" className="shrink-0">
                <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                Create Content
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
