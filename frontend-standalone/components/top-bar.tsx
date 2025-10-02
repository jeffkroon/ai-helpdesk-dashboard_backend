"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Calendar, Download, GitCompare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TopBar() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/export?format=${format}&projectId=project-1&range=last-30-days`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `voiceflow-analytics-${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("[v0] Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <Select defaultValue="last-30-days">
          <SelectTrigger className="w-[180px]" aria-label="Select date range">
            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="project-1">
          <SelectTrigger className="w-[200px]" aria-label="Select project">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project-1">Main Chatbot</SelectItem>
            <SelectItem value="project-2">Support Bot</SelectItem>
            <SelectItem value="project-3">Sales Assistant</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={compareMode ? "default" : "outline"}
          size="sm"
          onClick={() => setCompareMode(!compareMode)}
          aria-label="Toggle comparison mode"
          aria-pressed={compareMode}
        >
          <GitCompare className="h-4 w-4" aria-hidden="true" />
          <span className="ml-2">Compare</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isExporting} aria-label="Export report">
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="ml-2">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} aria-label="Refresh data">
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} aria-hidden="true" />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>
    </header>
  )
}
