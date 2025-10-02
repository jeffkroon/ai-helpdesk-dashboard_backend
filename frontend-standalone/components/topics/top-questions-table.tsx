"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MessageCircleQuestion } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

const questions = [
  { question: "How do I reset my password?", count: 342, category: "Account" },
  { question: "What are your shipping options?", count: 298, category: "Shipping" },
  { question: "Do you offer refunds?", count: 276, category: "Returns" },
  { question: "How can I track my order?", count: 254, category: "Shipping" },
  { question: "What payment methods do you accept?", count: 231, category: "Billing" },
  { question: "Is there a mobile app?", count: 198, category: "Product" },
  { question: "How do I cancel my subscription?", count: 187, category: "Account" },
  { question: "What is your return policy?", count: 165, category: "Returns" },
]

export function TopQuestionsTable() {
  const [search, setSearch] = useState("")

  const filtered = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()),
  )

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={MessageCircleQuestion}
        title="No Questions Detected Yet"
        description="Once your chatbot starts receiving user questions, they'll appear here. Make sure your Voiceflow project is properly configured to capture user inputs."
        actionLabel="Check Integration Settings"
        actionHref="/dashboard/settings"
      />
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Top User Questions</CardTitle>
        <CardDescription className="text-muted-foreground">Most common questions from transcripts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search questions or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border text-foreground"
            aria-label="Search questions"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <MessageCircleQuestion className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No questions found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Question</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-right text-muted-foreground">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="font-medium text-foreground">{q.question}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                      {q.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-foreground">{q.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
