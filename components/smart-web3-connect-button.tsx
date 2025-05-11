"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { MockWeb3ConnectButton } from "./mock-web3-connect-button"

// Dynamically import the real Web3ConnectButton with no SSR
const Web3ConnectButtonClient = dynamic(() => import("./web3-connect-button").then((mod) => mod.Web3ConnectButton), {
  ssr: false,
})

export function SmartWeb3ConnectButton() {
  const [isPreview, setIsPreview] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if we're in a preview environment
    const hostname = window.location.hostname
    setIsPreview(hostname.includes("vercel.app") || hostname === "localhost" || hostname === "127.0.0.1")
  }, [])

  if (!mounted) return null

  // In preview mode, use the mock button
  if (isPreview) {
    return <MockWeb3ConnectButton />
  }

  // In production, use the real button
  return <Web3ConnectButtonClient />
}
