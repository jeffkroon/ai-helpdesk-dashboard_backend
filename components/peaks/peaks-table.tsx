import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const peakMoments = [
  { period: "Mon 14:00-15:00", count: 1247, share: 8.2 },
  { period: "Wed 10:00-11:00", count: 1189, share: 7.8 },
  { period: "Fri 16:00-17:00", count: 1156, share: 7.6 },
  { period: "Tue 13:00-14:00", count: 1098, share: 7.2 },
  { period: "Thu 11:00-12:00", count: 1034, share: 6.8 },
]

export function PeaksTable() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Top Peak Moments</CardTitle>
        <CardDescription className="text-muted-foreground">Highest traffic periods</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Period</TableHead>
              <TableHead className="text-right text-muted-foreground">Count</TableHead>
              <TableHead className="text-right text-muted-foreground">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peakMoments.map((peak) => (
              <TableRow key={peak.period} className="border-border">
                <TableCell className="font-medium text-foreground">{peak.period}</TableCell>
                <TableCell className="text-right text-foreground">{peak.count.toLocaleString()}</TableCell>
                <TableCell className="text-right text-chart-1">{peak.share}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
