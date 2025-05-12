"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useEffect, useState } from "react"
import { isPreviewEnvironment } from "@/lib/environment"
import dynamic from "next/dynamic"
import { QueryClientProvider } from "@/components/providers/query-client-provider"

// Dynamically import the Web3ConnectButton to avoid SSR issues
const Web3ConnectButton = dynamic(() => import("./web3-connect-button").then((mod) => mod.Web3ConnectButton), {
  ssr: false,
  loading: () => (
    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
      <Wallet className="mr-2 h-4 w-4" />
      Loading...
    </Button>
  ),
})

export function WalletConnector() {
  const [mounted, setMounted] = useState(false)
  const isPreview = isPreviewEnvironment()

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  // In preview mode, show a mock button
  if (isPreview) {
    return (
      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Wallet className="mr-2 h-4 w-4" />
        Preview Mode
      </Button>
    )
  }

  // In production, use the Web3ConnectButton wrapped in QueryClientProvider
  return (
    <QueryClientProvider>
      <Web3ConnectButton />
    </QueryClientProvider>
  )
}
