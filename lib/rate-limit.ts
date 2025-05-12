export interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval: number
}

interface RateLimitClient {
  check: (request: Request, limit: number) => Promise<void>
}

// In-memory store for rate limiting
// In production, consider using Redis or another distributed store
const tokenCache = new Map<string, number[]>()

export function rateLimit(options: RateLimitOptions): RateLimitClient {
  const { interval, uniqueTokenPerInterval } = options

  // Clean up the cache periodically
  setInterval(() => {
    const now = Date.now()
    for (const [key, timestamps] of tokenCache.entries()) {
      const newTimestamps = timestamps.filter((timestamp) => now - timestamp < interval)
      if (newTimestamps.length > 0) {
        tokenCache.set(key, newTimestamps)
      } else {
        tokenCache.delete(key)
      }
    }
  }, interval)

  return {
    check: async (request: Request, limit: number) => {
      // Get client IP or a unique identifier
      const ip = request.headers.get("x-forwarded-for") || "anonymous"
      const tokenKey = ip

      // Get the current timestamps for this token
      const now = Date.now()
      const timestamps = tokenCache.get(tokenKey) || []

      // Filter out timestamps older than the interval
      const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < interval)

      // Check if the number of recent requests exceeds the limit
      if (recentTimestamps.length >= limit) {
        throw new Error("Rate limit exceeded")
      }

      // Add the current timestamp and update the cache
      recentTimestamps.push(now)
      tokenCache.set(tokenKey, recentTimestamps)

      // Ensure we don't exceed the total number of tokens we track
      if (tokenCache.size > uniqueTokenPerInterval) {
        // Delete the oldest entry
        const oldestKey = Array.from(tokenCache.keys())[0]
        tokenCache.delete(oldestKey)
      }
    },
  }
}
