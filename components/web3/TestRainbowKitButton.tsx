"use client"

import { useState, useEffect } from "react"
import { CyberButton } from "@/components/ui/cyber-button"
import dynamic from "next/dynamic"

// Dynamically import the RainbowKitTest component
const RainbowKitTest = dynamic(() => import("./RainbowKitTest").then((mod) => mod.RainbowKitTest), {
  ssr: false,
})

/**
 * TestRainbowKitButton Component
 *
 * This component provides a button to test the RainbowKit styling.
 * When clicked, it renders the RainbowKitTest component.
 */
export function TestRainbowKitButton() {
  const [showTest, setShowTest] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Only show in development mode or Vercel preview
  if (
    process.env.NODE_ENV !== "development" &&
    typeof window !== "undefined" &&
    !window.location.hostname.includes("vusercontent.net") &&
    !window.location.hostname.includes("v0.dev") &&
    !window.location.hostname.includes("vercel.app")
  ) {
    return null
  }

  return (
    <>
      <CyberButton
        variant="outline"
        size="sm"
        onClick={() => setShowTest(true)}
        className="fixed bottom-4 left-4 z-50 text-xs"
      >
        Test RainbowKit
      </CyberButton>

      {showTest && <RainbowKitTest />}
    </>
  )
}

export default TestRainbowKitButton
