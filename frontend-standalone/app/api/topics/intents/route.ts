import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const start = searchParams.get("start")
  const end = searchParams.get("end")
  const limit = searchParams.get("limit") || "50"

  // TODO: Call Python backend

  return NextResponse.json({
    intents: [
      { name: "Product Info", count: 2847 },
      { name: "Pricing", count: 2134 },
      { name: "Support Request", count: 1923 },
    ],
  })
}
