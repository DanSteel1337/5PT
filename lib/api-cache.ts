// Simple in-memory cache
// In production, consider using Redis or another distributed cache
const cache = new Map<string, { value: string; expiry: number }>()

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, { expiry }] of cache.entries()) {
    if (now > expiry) {
      cache.delete(key)
    }
  }
}, 60000) // Clean up every minute

export const cacheResponse = {
  async get(key: string): Promise<string | null> {
    const entry = cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.expiry) {
      cache.delete(key)
      return null
    }

    return entry.value
  },

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    const expiry = Date.now() + ttlSeconds * 1000
    cache.set(key, { value, expiry })
  },
}
