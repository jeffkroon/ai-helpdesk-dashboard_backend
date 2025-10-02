"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, TrendingUp, MessageSquare, Heart, Lightbulb, FileText } from "lucide-react"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Usage Peaks", href: "/dashboard/peaks", icon: TrendingUp },
  { name: "Topics", href: "/dashboard/topics", icon: MessageSquare },
  { name: "Sentiment & Scores", href: "/dashboard/sentiment", icon: Heart },
  { name: "Recommendations", href: "/dashboard/recommendations", icon: Lightbulb },
  { name: "Transcripts", href: "/dashboard/transcripts", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card" role="navigation" aria-label="Main navigation">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold text-foreground">Voiceflow Analytics</h1>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
