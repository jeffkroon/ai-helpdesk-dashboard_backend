import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = Array.from({ length: 24 }, (_, i) => i)

// Generate mock heatmap data
const heatmapData = days.flatMap((day) =>
  hours.map((hour) => ({
    day,
    hour,
    value: Math.floor(Math.random() * 100),
  })),
)

function getHeatColor(value: number) {
  if (value < 25) return "bg-chart-1/20"
  if (value < 50) return "bg-chart-1/40"
  if (value < 75) return "bg-chart-1/60"
  return "bg-chart-1/80"
}

export function PeaksHeatmap() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Activity Heatmap</CardTitle>
        <CardDescription className="text-muted-foreground">Day × Hour usage pattern</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <span className="w-8 text-xs text-muted-foreground">{day}</span>
              <div className="flex flex-1 gap-1">
                {hours.map((hour) => {
                  const dataPoint = heatmapData.find((d) => d.day === day && d.hour === hour)
                  return (
                    <div
                      key={hour}
                      className={`h-4 flex-1 rounded-sm ${getHeatColor(dataPoint?.value || 0)}`}
                      title={`${day} ${hour}:00 - ${dataPoint?.value} interactions`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Less activity</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-chart-1/20" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/40" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/60" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/80" />
          </div>
          <span>More activity</span>
        </div>
      </CardContent>
    </Card>
  )
}
