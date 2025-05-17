/**
 * Utility functions for the 5PT Investment Dashboard
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a crypto value with the token symbol
 * @param value The value to format
 * @param symbol The token symbol
 * @returns Formatted string
 */
export function formatCrypto(value: number, symbol = "5PT"): string {
  // Format with 6 decimal places for small values, 2 for larger values
  const formatted = value < 0.01 ? value.toFixed(6) : value.toFixed(2)
  return `${formatted} ${symbol}`
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
 * Formats a wallet address for display
 * @param address The wallet address
 * @returns Shortened address
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

/**
 * Formats a date for display
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Formats a percentage for display
 * @param value The percentage value
 * @returns Formatted percentage string
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
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
