"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Dynamically import the PoolList component with SSR disabled
const PoolList = dynamic(
  () => import("@/components/pools/PoolList").then((mod) => ({ default: () => <mod.PoolList /> })),
  { ssr: false },
)

export function PoolListWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PoolList />
    </Suspense>
  )
}
