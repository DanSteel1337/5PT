"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@/components/web3/ConnectButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface AuthCheckProps {
  children: ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md glass border-amber-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src="/images/5pt-logo.png"
                alt="Five Pillars Token"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to access the Five Pillars Investment Platform</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
