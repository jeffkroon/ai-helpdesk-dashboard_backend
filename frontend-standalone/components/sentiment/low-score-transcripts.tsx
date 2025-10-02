import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

const lowScoreTranscripts = [
  { id: "tr_abc123", date: "2025-02-08 14:32", userId: "user_***4521", score: 1, sentiment: "Negative" },
  { id: "tr_def456", date: "2025-02-08 11:15", userId: "user_***8734", score: 1, sentiment: "Negative" },
  { id: "tr_ghi789", date: "2025-02-07 16:48", userId: "user_***2109", score: 2, sentiment: "Negative" },
  { id: "tr_jkl012", date: "2025-02-07 09:23", userId: "user_***6543", score: 2, sentiment: "Neutral" },
  { id: "tr_mno345", date: "2025-02-06 13:57", userId: "user_***9876", score: 2, sentiment: "Negative" },
]

export function LowScoreTranscripts() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Low-Score Transcripts</CardTitle>
        <CardDescription className="text-muted-foreground">
          Conversations that need attention (score ≤ 2)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Transcript ID</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">User ID</TableHead>
              <TableHead className="text-muted-foreground">Score</TableHead>
              <TableHead className="text-muted-foreground">Sentiment</TableHead>
              <TableHead className="text-right text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowScoreTranscripts.map((transcript) => (
              <TableRow key={transcript.id} className="border-border">
                <TableCell className="font-mono text-sm text-foreground">{transcript.id}</TableCell>
                <TableCell className="text-foreground">{transcript.date}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{transcript.userId}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-destructive/20 px-2.5 py-0.5 text-xs font-medium text-destructive">
                    {transcript.score}
                  </span>
                </TableCell>
                <TableCell className="text-foreground">{transcript.sentiment}</TableCell>
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
      </CardContent>
    </Card>
  )
}
