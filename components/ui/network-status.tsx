"use client"

import { useAccount, useSwitchChain } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NetworkStatus() {
  const { chain } = useAccount()
  const { switchChain, isPending: isSwitchingNetwork } = useSwitchChain()

  const isCorrectNetwork = chain?.id === bscTestnet.id || chain?.id === bsc.id

  const handleSwitchToBSC = () => {
    if (switchChain) {
      switchChain({ chainId: bscTestnet.id })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                isCorrectNetwork
                  ? "bg-green-900/20 text-green-400 border border-green-500/30"
                  : "bg-red-900/20 text-red-400 border border-red-500/30",
              )}
            >
              {isCorrectNetwork ? (
                <>
                  <CheckCircle2 size={12} />
                  <span>{chain?.name || "BSC"}</span>
                </>
              ) : (
                <>
                  <AlertCircle size={12} />
                  <span>Wrong Network</span>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-black/90 border border-amber-600/30 text-white">
            {isCorrectNetwork
              ? "You are connected to the correct network"
              : "Please switch to BSC Testnet or BSC Mainnet"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!isCorrectNetwork && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7 px-2 bg-amber-900/20 border-amber-600/30 text-amber-300 hover:bg-amber-900/30"
          onClick={handleSwitchToBSC}
          disabled={isSwitchingNetwork}
        >
          {isSwitchingNetwork ? "Switching..." : "Switch to BSC"}
        </Button>
      )}
    </div>
  )
}
