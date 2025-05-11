/**
 * Utility functions for handling binary data in blockchain interactions
 */

// Convert hex string to Uint8Array properly
export function hexToBytes(hex: string): Uint8Array {
  // Remove 0x prefix if present
  hex = hex.startsWith("0x") ? hex.substring(2) : hex

  // Ensure even length
  if (hex.length % 2 !== 0) {
    hex = "0" + hex
  }

  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16)
  }

  return bytes
}

// Convert Uint8Array to hex string
export function bytesToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  )
}

// Safely handle byte arrays in contract calls
export function safelyHandleBytes(data: unknown): Uint8Array {
  if (data instanceof Uint8Array) {
    return data
  }

  if (typeof data === "string") {
    return hexToBytes(data)
  }

  if (Array.isArray(data)) {
    // Convert array to Uint8Array properly
    return new Uint8Array(data)
  }

  // Default fallback
  return new Uint8Array()
}
