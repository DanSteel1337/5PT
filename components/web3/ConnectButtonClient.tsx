"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import the ConnectButton with SSR disabled
const ConnectButtonComponent = dynamic(
  () => import("@/components/web3/ConnectButton").then((mod) => mod.ConnectButton),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" size="default" disabled className="opacity-70">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    ),
  },
)

export function ConnectButtonClient() {
  return <ConnectButtonComponent />
}
