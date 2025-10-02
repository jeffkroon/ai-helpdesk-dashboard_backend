import { cn } from "@/lib/utils"

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-card border border-border", className)}>
      <div className="h-full w-full bg-muted/20" />
    </div>
  )
}
