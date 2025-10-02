"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data - in production, fetch from API
const data = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  interactions: Math.floor(Math.random() * 500) + 300,
}))

export function InteractionsChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Interactions Over Time</CardTitle>
        <CardDescription className="text-muted-foreground">
          Daily interaction volume for the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" />
            <XAxis dataKey="date" stroke="rgb(163, 163, 163)" fontSize={12} tickLine={false} />
            <YAxis stroke="rgb(163, 163, 163)" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(20, 20, 20)",
                border: "1px solid rgb(38, 38, 38)",
                borderRadius: "0.5rem",
                color: "rgb(250, 250, 250)",
              }}
            />
            <Area
              type="monotone"
              dataKey="interactions"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInteractions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
