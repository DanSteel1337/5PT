"use client"

import dynamic from "next/dynamic"

// Dynamically import the debug panel with SSR disabled
const DynamicDebugPanel = dynamic(
  () => import("@/components/debug/debug-panel").then((mod) => ({ default: mod.DebugPanel })),
  { ssr: false },
)

export function DebugPanelClient() {
  return <DynamicDebugPanel />
}
