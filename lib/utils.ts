import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format percentage
export function formatPercentage(value: string | number | bigint): string {
  let numValue: number

  if (typeof value === "bigint") {
    numValue = Number(value) / 100
  } else if (typeof value === "string") {
    numValue = Number.parseFloat(value)
  } else {
    numValue = value
  }

  return `${numValue.toFixed(2)}%`
}

// Format time duration
export function formatDuration(seconds: number | bigint): string {
  const days = Math.floor(Number(seconds) / 86400)

  if (days === 1) {
    return "1 day"
  }

  return `${days} days`
}
