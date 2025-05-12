// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  mainnet: {
    investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc" as `0x${string}`,
    fivePillarsToken: "0x8FafdFB035C9426a50D842873D5d401C933bE09F" as `0x${string}`,
    pancakeRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E" as `0x${string}`,
  },
  testnet: {
    investmentManager: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    fivePillarsToken: "0x0987654321098765432109876543210987654321" as `0x${string}`,
    pancakeRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1" as `0x${string}`,
  },
}

// Helper function to get contract address based on current network
export function getContractAddress(
  contractName: keyof (typeof CONTRACT_ADDRESSES)["mainnet"],
  chainId?: number,
): `0x${string}` {
  // Default to mainnet if chainId is not provided
  const network = chainId === 97 ? "testnet" : "mainnet"
  return CONTRACT_ADDRESSES[network][contractName]
}
