"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

export function ConnectButtonClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Short delay to ensure WalletProvider is fully initialized
    const timer = setTimeout(() => {
      setMounted(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-[140px] bg-muted/30 rounded-md animate-pulse"></div>
  }

  // Dynamically import the ConnectButton with SSR disabled
  const ConnectButtonComponent = dynamic(
    () => import("@/components/web3/ConnectButton").then((mod) => mod.ConnectButton),
    {
      ssr: false,
      loading: () => <div className="h-10 w-[140px] bg-muted/30 rounded-md animate-pulse"></div>,
    },
  )

  return <ConnectButtonComponent />
}
