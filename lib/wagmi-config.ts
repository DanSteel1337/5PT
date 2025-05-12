import { http, createConfig } from "wagmi"
import { bsc, bscTestnet, mainnet } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"
import { isPreviewEnvironment, getSiteMetadata } from "@/lib/environment"

// Get WalletConnect project ID from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

// Create connectors array based on environment
const getConnectors = () => {
  // Always include injected connector for MetaMask and other browser wallets
  const connectors = [injected()]

  // Only add WalletConnect in production environment with valid projectId
  if (!isPreviewEnvironment() && projectId) {
    try {
      const metadata = getSiteMetadata()

      connectors.push(
        walletConnect({
          projectId,
          showQrModal: true,
          metadata,
        }),
      )
    } catch (error) {
      console.warn("Failed to initialize WalletConnect:", error)
    }
  }

  return connectors
}

// Contract addresses with proper typing
export const CONTRACT_ADDRESSES = {
  token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F" as `0x${string}`, // 5PT Token
  investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc" as `0x${string}`, // Investment Manager
  treasury: "0x17D3846cC570ced5882E41a6a99CB87a8647C0Bb" as `0x${string}`,
  dexRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1" as `0x${string}`,
  priceToken: "0xfb5b838b6cfeedc2873ab27866079ac55363d37e" as `0x${string}`,
  pricePool: "0x231d9e7181e8479a8b40930961e93e7ed798542c" as `0x${string}`,
  wbnb: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" as `0x${string}`,
  referralSystem: "0x1234567890123456789012345678901234567890" as `0x${string}`, // Added missing referral system address
}

// Create wagmi config with proper error handling
export const config = createConfig({
  chains: [bsc, bscTestnet, mainnet],
  connectors: getConnectors(),
  transports: {
    [bsc.id]: http("https://bsc-dataseed1.binance.org"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
    [mainnet.id]: http(),
  },
})

// Also export as default for backward compatibility
export default config
