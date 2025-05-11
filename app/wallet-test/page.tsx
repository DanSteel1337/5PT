import { Web3ConnectButton } from "@/components/web3-connect-button"
import { WalletInfo } from "@/components/wallet-info"

export default function WalletTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Web3Modal Wallet Test</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
        <Web3ConnectButton />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <WalletInfo />
      </div>
    </div>
  )
}
