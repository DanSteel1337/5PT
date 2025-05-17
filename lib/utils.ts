import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string
 * @param inputs - Class names to combine
 * @returns Combined class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a cryptocurrency value (handles both number and BigInt)
 * @param value - Number or BigInt to format
 * @param symbol - Optional symbol to append (default: "5PT")
 * @param decimals - Optional decimal places for the token (default: 18)
 * @returns Formatted string
 */
export function formatCrypto(value: number | bigint | string, symbol = "5PT", decimals = 18): string {
  // Handle undefined or null
  if (value === undefined || value === null) return `0 ${symbol}`

  // Convert to string first to safely handle BigInt
  const valueStr = value.toString()

  // Check if it's a valid number string
  if (!/^-?\d+(\.\d+)?$/.test(valueStr) && !/^-?\d+n$/.test(valueStr)) {
    return `0 ${symbol}`
  }

  try {
    let numValue: number

    // Handle BigInt values (which need to be divided by 10^decimals)
    if (typeof value === "bigint") {
      // Convert to a decimal string with proper precision
      // For example, 1000000000000000000n (1 ETH in wei) becomes "1.0"
      const divisor = BigInt(10) ** BigInt(decimals)
      const integerPart = value / divisor
      const fractionalPart = value % divisor

      // Format the fractional part to have leading zeros
      const fractionalStr = fractionalPart.toString().padStart(decimals, "0")

      // Combine integer and fractional parts
      const combinedStr = `${integerPart}.${fractionalStr}`

      // Parse as float with limited precision to avoid floating point issues
      numValue = Number.parseFloat(Number.parseFloat(combinedStr).toFixed(6))
    }
    // Handle string values that might be large numbers
    else if (typeof value === "string") {
      // Check if it's a numeric string
      if (/^\d+$/.test(value) && value.length > 15) {
        // Treat as a big integer string (likely wei or similar)
        const bigValue = BigInt(value)
        const divisor = BigInt(10) ** BigInt(decimals)
        const integerPart = bigValue / divisor
        const fractionalPart = bigValue % divisor

        // Format the fractional part
        const fractionalStr = fractionalPart.toString().padStart(decimals, "0")
        const combinedStr = `${integerPart}.${fractionalStr}`

        numValue = Number.parseFloat(Number.parseFloat(combinedStr).toFixed(6))
      } else {
        // Regular number string
        numValue = Number.parseFloat(value)
      }
    }
    // Handle regular numbers
    else {
      numValue = value as number
    }

    // Check if conversion resulted in a valid number
    if (isNaN(numValue)) return `0 ${symbol}`

    // Format with appropriate decimal places
    const formatted =
      numValue >= 1
        ? numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })

    return `${formatted} ${symbol}`
  } catch (error) {
    console.error("Error formatting crypto value:", error)
    return `0 ${symbol}`
  }
}

/**
 * Formats a number as a percentage
 * @param value - Number to format (0.01 = 1%)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/**
 * Formats/truncates an Ethereum address for display
 * @param address - Ethereum address to format
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Alias for formatAddress for backward compatibility
 */
export function truncateAddress(address: string): string {
  return formatAddress(address)
}

/**
 * Formats a date as a relative time string
 * @param date - Date to format
 * @returns Relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

/**
 * Gets the name of a rank based on its level
 * @param rank The rank level (0-9)
 * @returns The rank name
 */
export function getRankName(rank: number): string {
  const rankNames = [
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
  return rankNames[Math.min(rank, rankNames.length - 1)]
}

/**
 * Gets the color class for a rank
 * @param rank The rank level (0-9)
 * @returns Tailwind color class
 */
export function getRankColor(rank: number): string {
  const rankColors = [
    "text-gray-400", // Novice
    "text-blue-400", // Apprentice
    "text-green-400", // Adept
    "text-yellow-400", // Expert
    "text-orange-400", // Master
    "text-red-400", // Grandmaster
    "text-purple-400", // Legend
    "text-pink-400", // Mythic
    "text-indigo-400", // Divine
    "text-gradient", // Immortal
  ]
  return rankColors[Math.min(rank, rankColors.length - 1)]
}

/**
 * Formats a number for display
 * @param value The number value
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Delays execution for a specified time
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Checks if a value is a valid number
 * @param value The value to check
 * @returns True if the value is a valid number
 */
export function isValidNumber(value: unknown): boolean {
  if (typeof value === "number") return !isNaN(value)
  if (typeof value === "string") return !isNaN(Number(value))
  return false
}

/**
 * Generates a random ID
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * Truncates text to a specified length
 * @param text The text to truncate
 * @param length Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}
