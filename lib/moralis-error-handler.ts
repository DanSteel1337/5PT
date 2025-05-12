import { NextResponse } from "next/server"

export class MoralisApiError extends Error {
  status: number
  responseBody: string

  constructor(message: string, status: number, responseBody: string) {
    super(message)
    this.name = "MoralisApiError"
    this.status = status
    this.responseBody = responseBody
  }
}

export function handleMoralisError(error: unknown) {
  console.error("Moralis API error:", error)

  if (error instanceof MoralisApiError) {
    // Handle specific Moralis API errors
    switch (error.status) {
      case 400:
        return NextResponse.json({ error: "Bad request to Moralis API", details: error.message }, { status: 400 })
      case 401:
        return NextResponse.json({ error: "Unauthorized access to Moralis API. Check your API key." }, { status: 401 })
      case 429:
        return NextResponse.json(
          { error: "Moralis API rate limit exceeded. Please try again later." },
          { status: 429, headers: { "Retry-After": "60" } },
        )
      case 500:
      case 502:
      case 503:
      case 504:
        return NextResponse.json({ error: "Moralis API service unavailable. Please try again later." }, { status: 503 })
      default:
        return NextResponse.json({ error: `Moralis API error: ${error.message}` }, { status: error.status || 500 })
    }
  }

  // Generic error handling
  return NextResponse.json({ error: "Failed to fetch data from Moralis API" }, { status: 500 })
}
