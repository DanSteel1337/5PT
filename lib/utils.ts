import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number with commas and specified decimal places
 * Safely handles undefined/null values
 */
export function formatNumber(num: number | string | undefined | null, decimals = 2): string {
  // Handle undefined or null values
  if (num === undefined || num === null) return "0.00"

  // Parse string to number if needed
  const parsedNum = typeof num === "string" ? Number.parseFloat(num) : num

  // Handle NaN
  if (isNaN(parsedNum)) return "0.00"

  try {
    return parsedNum.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  } catch (error) {
    console.error("Error formatting number:", error)
    return "0.00"
  }
}

/**
 * Format crypto amount with symbol
 * Safely handles undefined/null values
 */
export function formatCrypto(
  amount: number | string | bigint | undefined | null,
  symbol = "BNB",
  decimals = 4,
): string {
  // Handle undefined or null values
  if (amount === undefined || amount === null) return `0.0000 ${symbol}`

  // Handle BigInt
  if (typeof amount === "bigint") {
    try {
      // Convert BigInt to number for formatting
      // This is safe for display purposes
      return `${formatNumber(Number(amount) / 10 ** 18, decimals)} ${symbol}`
    } catch (error) {
      console.error("Error formatting BigInt:", error)
      return `0.0000 ${symbol}`
    }
  }

  try {
    return `${formatNumber(amount, decimals)} ${symbol}`
  } catch (error) {
    console.error("Error formatting crypto:", error)
    return `0.0000 ${symbol}`
  }
}

/**
 * Format address to show only first and last few characters
 * Safely handles undefined/null/invalid addresses
 */
export function formatAddress(address: string | undefined | null): string {
  if (!address) return ""

  // Validate address format (basic check)
  if (!address.startsWith("0x") || address.length < 10) return address

  try {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  } catch (error) {
    console.error("Error formatting address:", error)
    return address
  }
}

/**
 * Format percentage
 * Safely handles undefined/null values
 */
export function formatPercent(percent: number | undefined | null): string {
  if (percent === undefined || percent === null) return "0.00%"

  if (isNaN(percent)) return "0.00%"

  try {
    return `${percent.toFixed(2)}%`
  } catch (error) {
    console.error("Error formatting percent:", error)
    return "0.00%"
  }
}

/**
 * Format token amount from BigInt with proper decimals
 */
export function formatTokenAmount(amount: bigint | undefined | null, decimals = 18): number {
  if (amount === undefined || amount === null) return 0

  try {
    return Number(amount) / 10 ** decimals
  } catch (error) {
    console.error("Error formatting token amount:", error)
    return 0
  }
}

/**
 * Format date to locale string
 */
export function formatDate(
  date: Date | number | string | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  if (!date) return ""

  try {
    const dateObj = typeof date === "object" ? date : new Date(date)
    return dateObj.toLocaleDateString("en-US", options)
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

/**
 * Format time duration (seconds to days/hours/minutes/seconds)
 */
export function formatDuration(seconds: number | undefined | null): string {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "0s"

  try {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const parts = []

    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`)

    return parts.join(" ")
  } catch (error) {
    console.error("Error formatting duration:", error)
    return "0s"
  }
}

/**
 * Get rank name based on rank number
 */
export function getRankName(rank: number | undefined | null): string {
  if (rank === undefined || rank === null) return "Unknown"

  const ranks = [
    "Novice",
    "Apprentice",
    "Adept",
    "Expert",
    "Master",
    "Grandmaster",
    "Legend",
    "Mythic",
    "Divine",
    "Immortal",
  ]

  return ranks[rank] || "Unknown"
}

/**
 * Get rank color based on rank number
 */
export function getRankColor(rank: number | undefined | null): string {
  if (rank === undefined || rank === null) return "text-gray-400"

  const colors = [
    "text-gray-400",
    "text-blue-400",
    "text-green-400",
    "text-yellow-400",
    "text-orange-400",
    "text-red-400",
    "text-pink-400",
    "text-purple-400",
    "text-indigo-400",
    "text-violet-500",
  ]

  return colors[rank] || "text-gray-400"
}
