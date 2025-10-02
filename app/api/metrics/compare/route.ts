import { type NextRequest, NextResponse } from "next/server"

// This endpoint fetches data for both current and previous periods
// Backend should make two calls to Voiceflow API with different date ranges

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const projectId = searchParams.get("projectId")
  const startDate = searchParams.get("start")
  const endDate = searchParams.get("end")

  // In production, call your Python backend:
  // 1. Calculate previous period dates (e.g., if current is last 7 days, previous is 7 days before that)
  // 2. Make two parallel calls to Voiceflow Analytics API
  // 3. Calculate deltas and percentage changes
  // 4. Return comparison data

  // Example backend call:
  // const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/compare`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.VOICEFLOW_API_KEY}`
  //   },
  //   body: JSON.stringify({ projectId, startDate, endDate })
  // })

  // Mock comparison data
  const comparisonData = {
    current: {
      conversations: 12847,
      uniqueUsers: 8234,
      avgChatScore: 4.2,
      positiveSentiment: 53.1,
    },
    previous: {
      conversations: 11432,
      uniqueUsers: 7612,
      avgChatScore: 4.1,
      positiveSentiment: 50.5,
    },
    changes: {
      conversations: { absolute: 1415, percentage: 12.4 },
      uniqueUsers: { absolute: 622, percentage: 8.2 },
      avgChatScore: { absolute: 0.1, percentage: 2.4 },
      positiveSentiment: { absolute: 2.6, percentage: 5.1 },
    },
  }

  return NextResponse.json(comparisonData)
}
