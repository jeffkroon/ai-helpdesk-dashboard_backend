"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { score: "1", count: 234 },
  { score: "2", count: 456 },
  { score: "3", count: 1876 },
  { score: "4", count: 3421 },
  { score: "5", count: 2847 },
]

export function ScoresHistogram() {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const average = data.reduce((sum, item) => sum + Number.parseInt(item.score) * item.count, 0) / total

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Chat Score Distribution</CardTitle>
        <CardDescription className="text-muted-foreground">
          Average: {average.toFixed(2)} / 5.0 ({total.toLocaleString()} ratings)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" />
            <XAxis
              dataKey="score"
              stroke="rgb(163, 163, 163)"
              fontSize={12}
              tickLine={false}
              label={{ value: "Score", position: "insideBottom", offset: -5, fill: "rgb(163, 163, 163)" }}
            />
            <YAxis stroke="rgb(163, 163, 163)" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(20, 20, 20)",
                border: "1px solid rgb(38, 38, 38)",
                borderRadius: "0.5rem",
                color: "rgb(250, 250, 250)",
              }}
            />
            <Bar dataKey="count" fill="rgb(234, 179, 8)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
