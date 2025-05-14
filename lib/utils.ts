import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine class names with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number with commas
export function formatNumber(num: number | string, decimals = 2): string {
  const parsedNum = typeof num === "string" ? Number.parseFloat(num) : num
  return parsedNum.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// Format crypto amount with symbol
export function formatCrypto(amount: number | string, symbol = "BNB", decimals = 4): string {
  return `${formatNumber(amount, decimals)} ${symbol}`
}

// Format address to show only first and last few characters
export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Format percentage
export function formatPercent(percent: number): string {
  return `${percent.toFixed(2)}%`
}

// Get rank name based on rank number
export function getRankName(rank: number): string {
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

// Get rank color based on rank number
export function getRankColor(rank: number): string {
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
