"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useEffect, useState } from "react"

// Safe environment detection
const isBrowser = typeof window !== "undefined"
const isPreview =
  isBrowser &&
  (window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")

export function WalletConnector() {
  const [mounted, setMounted] = useState(false)

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // In preview mode, show a mock button
  if (isPreview) {
    return (
      <Button variant="outline" className="bg-purple-900/20 border-purple-500/30 text-white hover:bg-purple-900/30">
        <Wallet className="mr-2 h-4 w-4" />
        Preview Mode
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="bg-purple-900/20 border-purple-500/30 text-white hover:bg-purple-900/30"
      onClick={() => {
        // Connect wallet logic
        console.log("Connect wallet clicked")
      }}
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
