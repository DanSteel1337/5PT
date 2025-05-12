import { formatUnits } from "viem"

// Format currency with dollar sign
export function formatCurrency(value: string | number | bigint, decimals = 18): string {
  let formattedValue: string

  if (typeof value === "bigint") {
    formattedValue = formatUnits(value, decimals)
  } else if (typeof value === "string") {
    formattedValue = value
  } else {
    formattedValue = value.toString()
  }

  // Parse to float and format with 2 decimal places
  const floatValue = Number.parseFloat(formattedValue)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(floatValue)
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

// Shorten address
export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Format date from timestamp
export function formatDate(timestamp: number | bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString()
}
