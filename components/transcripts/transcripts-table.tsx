"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ExternalLink, MessageSquare } from "lucide-react"
import Link from "next/link"
import { EmptyState } from "@/components/empty-state"

const transcripts = [
  {
    id: "tr_abc123",
    startTime: "2025-02-08 14:32:15",
    userId: "user_***4521",
    duration: "4m 23s",
    score: 4,
    sentiment: "Positive",
  },
  { id: "tr_def456", startTime: "2025-02-08 14:15:42", userId: "user_***8734", score: 5, sentiment: "Positive" },
  {
    id: "tr_ghi789",
    startTime: "2025-02-08 13:48:09",
    userId: "user_***2109",
    duration: "2m 15s",
    score: 3,
    sentiment: "Neutral",
  },
  {
    id: "tr_jkl012",
    startTime: "2025-02-08 13:23:56",
    userId: "user_***6543",
    duration: "6m 47s",
    score: 2,
    sentiment: "Negative",
  },
  {
    id: "tr_mno345",
    startTime: "2025-02-08 12:57:33",
    userId: "user_***9876",
    duration: "3m 12s",
    score: 4,
    sentiment: "Positive",
  },
  {
    id: "tr_pqr678",
    startTime: "2025-02-08 12:34:21",
    userId: "user_***3210",
    duration: "5m 38s",
    score: 5,
    sentiment: "Positive",
  },
  {
    id: "tr_stu901",
    startTime: "2025-02-08 11:59:47",
    userId: "user_***7654",
    duration: "1m 54s",
    score: 3,
    sentiment: "Neutral",
  },
  {
    id: "tr_vwx234",
    startTime: "2025-02-08 11:42:18",
    userId: "user_***4321",
    duration: "4m 05s",
    score: 4,
    sentiment: "Positive",
  },
]

export function TranscriptsTable() {
  const [search, setSearch] = useState("")

  const filtered = transcripts.filter(
    (t) => t.id.toLowerCase().includes(search.toLowerCase()) || t.userId.toLowerCase().includes(search.toLowerCase()),
  )

  if (transcripts.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No Transcripts Available"
        description="Transcripts will appear here once users start interacting with your Voiceflow chatbot. Make sure your bot is published and accessible to users."
        actionLabel="View Integration Guide"
        actionHref="https://docs.voiceflow.com"
      />
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">All Transcripts</CardTitle>
        <CardDescription className="text-muted-foreground">{filtered.length} conversations found</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by transcript ID or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border text-foreground"
            aria-label="Search transcripts"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No transcripts found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Transcript ID</TableHead>
                  <TableHead className="text-muted-foreground">Start Time</TableHead>
                  <TableHead className="text-muted-foreground">User ID</TableHead>
                  <TableHead className="text-muted-foreground">Duration</TableHead>
                  <TableHead className="text-muted-foreground">Score</TableHead>
                  <TableHead className="text-muted-foreground">Sentiment</TableHead>
                  <TableHead className="text-right text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((transcript) => (
                  <TableRow key={transcript.id} className="border-border">
                    <TableCell className="font-mono text-sm text-foreground">{transcript.id}</TableCell>
                    <TableCell className="text-foreground">{transcript.startTime}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{transcript.userId}</TableCell>
                    <TableCell className="text-foreground">{transcript.duration || "N/A"}</TableCell>
                    <TableCell>
                      {transcript.score && (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            transcript.score >= 4
                              ? "bg-chart-4/20 text-chart-4"
                              : transcript.score >= 3
                                ? "bg-chart-2/20 text-chart-2"
                                : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {transcript.score}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground">{transcript.sentiment || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/transcripts/${transcript.id}`}>
                          View <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
