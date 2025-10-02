"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock hourly data
const data = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  count: Math.floor(Math.random() * 200) + 50,
}))

export function PeaksChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Hourly Interaction Pattern</CardTitle>
        <CardDescription className="text-muted-foreground">Average interactions by hour of day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" />
            <XAxis dataKey="hour" stroke="rgb(163, 163, 163)" fontSize={12} tickLine={false} />
            <YAxis stroke="rgb(163, 163, 163)" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(20, 20, 20)",
                border: "1px solid rgb(38, 38, 38)",
                borderRadius: "0.5rem",
                color: "rgb(250, 250, 250)",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              dot={{ fill: "rgb(59, 130, 246)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
