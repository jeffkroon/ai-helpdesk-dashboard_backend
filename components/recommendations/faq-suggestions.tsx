import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Plus } from "lucide-react"

const suggestions = [
  {
    question: "How do I migrate from v1 to v2 API?",
    reason: "Asked 89 times, no direct answer in KB. Average resolution time: 12 minutes.",
  },
  {
    question: "What are the rate limits for the free tier?",
    reason: "Frequently asked (67 times), current answer is buried in pricing page.",
  },
  {
    question: "Can I use custom domains with my project?",
    reason: "High interest (54 mentions), unclear documentation.",
  },
  {
    question: "How do I export my data?",
    reason: "Common request (43 times), no self-service option documented.",
  },
]

export function FAQSuggestions() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">FAQ Suggestions</CardTitle>
        <CardDescription className="text-muted-foreground">
          Questions that should be added to your FAQ or knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, i) => (
          <div key={i} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-chart-1" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">{suggestion.question}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
                <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                Add FAQ
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
