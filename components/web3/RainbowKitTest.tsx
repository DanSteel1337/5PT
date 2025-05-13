"use client"

import { useState, useEffect } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { CyberButton } from "@/components/ui/cyber-button"
import { CyberCard } from "@/components/ui/cyber-card"
import { RainbowKitDebug } from "./RainbowKitDebug"

/**
 * RainbowKitTest Component
 *
 * This component provides a test environment for RainbowKit styling.
 * It displays the ConnectButton and RainbowKitDebug components.
 */
export function RainbowKitTest() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <CyberCard className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          RainbowKit Test
        </h2>

        <div className="space-y-6">
          <div className="p-4 border border-purple-500/30 rounded-lg bg-black/50">
            <h3 className="text-sm font-medium mb-2 text-gray-300">Default ConnectButton:</h3>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>

          <div className="p-4 border border-purple-500/30 rounded-lg bg-black/50">
            <h3 className="text-sm font-medium mb-2 text-gray-300">ConnectButton with Custom Label:</h3>
            <div className="flex justify-center">
              <ConnectButton label="Connect Wallet" />
            </div>
          </div>

          <div className="p-4 border border-purple-500/30 rounded-lg bg-black/50">
            <h3 className="text-sm font-medium mb-2 text-gray-300">ConnectButton with Custom Styling:</h3>
            <div className="flex justify-center">
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                  const ready = mounted
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
                          return <CyberButton onClick={openConnectModal}>Connect Wallet</CyberButton>
                        }

                        return (
                          <div className="flex items-center gap-2">
                            <CyberButton onClick={openChainModal} variant="outline" size="sm">
                              {chain.name}
                            </CyberButton>

                            <CyberButton onClick={openAccountModal}>{account.displayName}</CyberButton>
                          </div>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <CyberButton
            variant="outline"
            onClick={() => {
              // Close the test modal
              const testModal = document.getElementById("rainbowkit-test-modal")
              if (testModal) {
                testModal.remove()
              }
            }}
          >
            Close Test
          </CyberButton>
        </div>

        {/* Always show debug in test mode */}
        <div className="absolute bottom-4 right-4">
          <RainbowKitDebug forceShow={true} />
        </div>
      </CyberCard>
    </div>
  )
}

export default RainbowKitTest
