"use client"

import { useState, useEffect } from "react"
import { isPreviewEnvironment } from "@/lib/environment"
import dynamic from "next/dynamic"

// Dynamically import the real header with Web3 functionality
const ModernHeader = dynamic(() => import("./modern-header"), {
  ssr: false,
  loading: () => <MockModernHeader />,
})

// Import the mock header directly since it doesn't have Web3 dependencies
import { MockModernHeader } from "./mock-modern-header"

export function SmartHeader() {
  const [mounted, setMounted] = useState(false)
  const isPreview = isPreviewEnvironment()

  useEffect(() => {
    setMounted(true)
  }, [])

  // In preview mode or during SSR, use the mock header
  if (!mounted || isPreview) {
    return <MockModernHeader />
  }

  // In production mode, use the real header with Web3 functionality
  return <ModernHeader />
}
