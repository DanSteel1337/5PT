"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

// Simple component that doesn't rely on web3 libraries
export function WalletConnector() {
  // Safe environment detection
  const isPreview =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")

  // In preview mode, show a mock button
  if (isPreview) {
    return (
      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Wallet className="mr-2 h-4 w-4" />
        Preview Mode
      </Button>
    )
  }

  // In production, use the connect button
  return (
    <Button
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      onClick={() => {
        // This will be replaced with actual wallet connection logic
        alert("Wallet connection is disabled in preview mode")
      }}
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
