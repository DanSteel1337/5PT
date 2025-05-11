import { http, createConfig } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// Get WalletConnect project ID from environment variable
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

// Define chains to support
const chains = [bsc, ...(process.env.NODE_ENV === "development" ? [bscTestnet] : [])]

// Create wagmi config with minimal setup
export const config = createConfig({
  chains,
  transports: {
    [bsc.id]: http(),
    ...(process.env.NODE_ENV === "development" ? { [bscTestnet.id]: http() } : {}),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    }),
  ],
})

// Contract addresses - Updated with deployed contracts
export const CONTRACT_ADDRESSES = {
  token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F" as `0x${string}`, // 5PT Token
  investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc" as `0x${string}`, // Investment Manager
  treasury: "0x17D3846cC570ced5882E41a6a99CB87a8647C0Bb" as `0x${string}`,
  dexRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1" as `0x${string}`,
  // For price data
  priceToken: "0xfb5b838b6cfeedc2873ab27866079ac55363d37e" as `0x${string}`,
  pricePool: "0x231d9e7181e8479a8b40930961e93e7ed798542c" as `0x${string}`,
  wbnb: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" as `0x${string}`,
}
