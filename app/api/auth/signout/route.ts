import { NextResponse } from "next/server"

export async function POST() {
  // Clear any auth tokens/cookies
  const response = NextResponse.json({ success: true })
  response.cookies.delete("auth-token") // Adjust cookie name based on your auth setup
  return response
}
