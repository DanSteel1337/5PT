"use client"

import { useState, useEffect } from "react"
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"

export function ConnectButton() {
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted: rainbowMounted }) => {
        const ready = mounted && rainbowMounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Connect Wallet
                  </Button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <Button onClick={openChainModal} variant="outline" size="sm" className="hidden md:flex">
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {account.displayName}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
