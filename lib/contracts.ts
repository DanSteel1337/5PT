// Contract ABIs
export const INVESTMENT_MANAGER_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getUserRank",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getUserTotalDeposits",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getUserReferralBonus",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getUserReferralCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getUserPoolRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalInvestors",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalValueLocked",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const TOKEN_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Contract addresses
export const CONTRACT_ADDRESSES = {
  mainnet: {
    investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc",
    fivePillarsToken: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
  },
  testnet: {
    investmentManager: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
    fivePillarsToken: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
  },
}

// Helper to get the correct contract address based on network
export function getContractAddress(contractName: keyof typeof CONTRACT_ADDRESSES.mainnet, chainId: number) {
  const isTestnet = chainId === 97 // BSC Testnet
  const addresses = isTestnet ? CONTRACT_ADDRESSES.testnet : CONTRACT_ADDRESSES.mainnet
  return addresses[contractName]
}
