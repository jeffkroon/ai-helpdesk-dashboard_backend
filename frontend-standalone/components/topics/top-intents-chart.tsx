"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Product Info", count: 2847 },
  { name: "Pricing", count: 2134 },
  { name: "Support Request", count: 1923 },
  { name: "Account Help", count: 1654 },
  { name: "Shipping Status", count: 1432 },
  { name: "Returns", count: 1287 },
  { name: "Technical Issue", count: 1098 },
  { name: "Feature Request", count: 876 },
  { name: "Billing Question", count: 743 },
  { name: "General Inquiry", count: 621 },
]

export function TopIntentsChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Top Intents</CardTitle>
        <CardDescription className="text-muted-foreground">Most frequently triggered intents</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" />
            <XAxis type="number" stroke="rgb(163, 163, 163)" fontSize={12} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="rgb(163, 163, 163)"
              fontSize={12}
              tickLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(20, 20, 20)",
                border: "1px solid rgb(38, 38, 38)",
                borderRadius: "0.5rem",
                color: "rgb(250, 250, 250)",
              }}
            />
            <Bar dataKey="count" fill="rgb(59, 130, 246)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
