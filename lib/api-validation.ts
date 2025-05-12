// Validate Ethereum-style address format
export function validateTokenAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// List of supported chains
const SUPPORTED_CHAINS = [
  "eth",
  "goerli",
  "sepolia",
  "polygon",
  "mumbai",
  "bsc",
  "bsc_testnet",
  "avalanche",
  "fantom",
  "cronos",
  "palm",
  "arbitrum",
  "arbitrum_goerli",
  "optimism",
]

// Validate chain parameter
export function validateChain(chain: string): boolean {
  return SUPPORTED_CHAINS.includes(chain.toLowerCase())
}

// Validate numeric parameters
export function validateNumericParam(value: string, min: number, max: number): boolean {
  const num = Number.parseInt(value, 10)
  return !isNaN(num) && num >= min && num <= max
}
