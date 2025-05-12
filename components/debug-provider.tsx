"use client"

import type React from "react"

import { EnvironmentDebugPanel } from "./debug/environment-panel"
import { isDevelopment, isPreviewEnvironment } from "@/lib/environment"

export function DebugProvider({ children }: { children: React.ReactNode }) {
  // Only show debug tools in development or preview environments
  const showDebugTools = isDevelopment() || isPreviewEnvironment()

  return (
    <>
      {children}
      {showDebugTools && <EnvironmentDebugPanel />}
    </>
  )
}
