"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Dynamically import the PoolDetail component with SSR disabled
const PoolDetail = dynamic(
  ({ poolId }: { poolId: string }) =>
    import("@/components/pools/PoolDetail").then((mod) => ({ default: () => <mod.PoolDetail poolId={poolId} /> })),
  { ssr: false },
)

export function PoolDetailWrapper({ poolId }: { poolId: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PoolDetail poolId={poolId} />
    </Suspense>
  )
}
