import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  // TODO: Call Python backend

  return NextResponse.json({
    items: [
      {
        id: "tr_abc123",
        startTime: new Date().toISOString(),
        userId: "user_***4521",
        score: 4,
        sentiment: "Positive",
      },
    ],
  })
}
