"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Wallet, ChevronDown } from "lucide-react"
import { useBalance } from "wagmi"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated")

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
                    className="bg-[rgba(170,0,255,0.8)] hover:bg-[rgba(170,0,255,1)] text-white"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    Wrong network
                  </Button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    className="hidden sm:flex border-[rgba(170,0,255,0.3)] text-[rgba(170,0,255,1)]"
                    size="sm"
                  >
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    className="bg-[rgba(170,0,255,0.8)] hover:bg-[rgba(170,0,255,1)] text-white"
                  >
                    <WalletBalance address={account.address} />
                    <span className="mx-2">{account.displayName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

function WalletBalance({ address }: { address: `0x${string}` }) {
  const { data } = useBalance({
    address,
  })

  if (!data) return null

  return (
    <span className="hidden sm:inline">
      {Number.parseFloat(formatUnits(data.value, data.decimals)).toFixed(4)} {data.symbol}
    </span>
  )
}
