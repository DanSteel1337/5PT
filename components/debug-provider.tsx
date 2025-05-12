"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DebugPanel } from "./debug/debug-panel"
import { ErrorBoundary } from "./error-boundary"

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {children}
      {isClient && (
        <ErrorBoundary componentName="DebugPanel" fallback={null}>
          <DebugPanel />
        </ErrorBoundary>
      )}
    </>
  )
}
