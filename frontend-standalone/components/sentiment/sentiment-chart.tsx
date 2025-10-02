"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Positive", value: 6821, color: "rgb(34, 197, 94)" },
  { name: "Neutral", value: 4102, color: "rgb(234, 179, 8)" },
  { name: "Negative", value: 1924, color: "rgb(239, 68, 68)" },
]

export function SentimentChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Sentiment Distribution</CardTitle>
        <CardDescription className="text-muted-foreground">Overall sentiment from evaluations</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(20, 20, 20)",
                border: "1px solid rgb(38, 38, 38)",
                borderRadius: "0.5rem",
                color: "rgb(250, 250, 250)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-foreground">{item.value.toLocaleString()}</span>
                <span className="ml-2 text-muted-foreground">({((item.value / total) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
