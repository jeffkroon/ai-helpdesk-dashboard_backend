import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // TODO: Call Python backend to get full transcript with logs

  return NextResponse.json({
    id,
    logs: [
      { role: "user", text: "Hello, I need help", timestamp: new Date().toISOString() },
      { role: "assistant", text: "Hi! How can I help you today?", timestamp: new Date().toISOString() },
    ],
    properties: { chat_score: 4 },
    evaluations: { sentiment: "Positive" },
  })
}
