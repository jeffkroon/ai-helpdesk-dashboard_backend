import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  // TODO: Call Python backend

  return NextResponse.json({
    series: Array.from({ length: 24 }, (_, i) => ({
      period: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      count: Math.floor(Math.random() * 200) + 50,
    })),
    top: [
      { period: "Mon 14:00-15:00", count: 1247, share: 8.2 },
      { period: "Wed 10:00-11:00", count: 1189, share: 7.8 },
    ],
  })
}
