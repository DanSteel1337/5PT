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
  // Adding new functions from the contract documentation
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "accountToInvestorInfo",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalDeposit", type: "uint256" },
          { internalType: "uint256", name: "totalReferralDeposit", type: "uint256" },
          { internalType: "uint256", name: "referralCount", type: "uint256" },
          { internalType: "address", name: "referrer", type: "address" },
          { internalType: "uint256", name: "lastDepositTime", type: "uint256" },
          { internalType: "uint256", name: "lastClaimTime", type: "uint256" },
        ],
        internalType: "struct InvestmentManager.InvestorInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint8", name: "poolId", type: "uint8" },
    ],
    name: "isInvestorInPool",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAccumulatedRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastRoundRewards",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "dailyReward", type: "uint256" },
          { internalType: "uint256", name: "refReward", type: "uint256" },
          { internalType: "uint256", name: "poolsReward", type: "uint256" },
        ],
        internalType: "struct InvestmentManager.LastRoundRewards",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "referrer", type: "address" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
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
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Contract addresses - These match the documentation
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

// Updated contract constants from latest documentation
export const CONTRACT_CONSTANTS = {
  BASIS_POINTS: 1000000,
  ROUND_DURATION: 86400, // 24 hours in seconds
  DEPOSIT_DELAY: 14400, // 4 hours in seconds
  POOL_CRITERIA_UPDATE_DELAY: 108000, // 30 hours in seconds
  CLAIM_TAX_PERCENT: 10, // Default 10%
  DEPOSIT_TAX_PERCENT: 10, // Default 10%
  MIN_DEPOSIT: 1 * 10 ** 18, // 1 token minimum
  TOKEN_DECIMALS: 18,
  TOTAL_SUPPLY: 100_000_000_000 * 10 ** 18, // 100B tokens
}

// Update the REWARD_SYSTEM object to reflect the correct values
export const REWARD_SYSTEM = {
  dailyBonus: 0.003, // 0.3% daily
  directReferralBonus: 0.00025, // 0.025% daily on direct referrals
  downlineReferralBonus: 0.0006, // 0.06% daily from downline referrals
  reinvestmentPercent: 0.5, // 50% of rewards are automatically reinvested
  claimTaxPercent: 0.1, // 10% claim tax
  depositTaxPercent: 0.1, // 10% deposit tax
}

// Updated pool qualification criteria from latest documentation
export const POOL_CRITERIA = [
  {
    id: 0,
    personalInvestment: 550 * 10 ** 18, // ~$1,000
    directInvestment: 550 * 10 ** 18, // ~$1,000
    directRefs: 1,
    share: 175, // 0.0175% daily
  },
  {
    id: 1,
    personalInvestment: 145 * 10 ** 19, // ~$2,500
    directInvestment: 145 * 10 ** 19, // ~$2,500
    directRefs: 3,
    share: 175, // 0.0175% daily
  },
  {
    id: 2,
    personalInvestment: 3 * 10 ** 21, // ~$5,000
    directInvestment: 6 * 10 ** 21, // ~$10,000
    directRefs: 5,
    share: 175, // 0.0175% daily
  },
  {
    id: 3,
    personalInvestment: 55 * 10 ** 20, // ~$10,000
    directInvestment: 11 * 10 ** 21, // ~$20,000
    directRefs: 10,
    share: 175, // 0.0175% daily
  },
  {
    id: 4,
    personalInvestment: 1425 * 10 ** 19, // ~$25,000
    directInvestment: 285 * 10 ** 20, // ~$50,000
    directRefs: 15,
    share: 175, // 0.0175% daily
  },
  {
    id: 5,
    personalInvestment: 285 * 10 ** 20, // ~$50,000
    directInvestment: 855 * 10 ** 20, // ~$150,000
    directRefs: 20,
    share: 100, // 0.01% daily
  },
  {
    id: 6,
    personalInvestment: 57 * 10 ** 21, // ~$100,000
    directInvestment: 171 * 10 ** 21, // ~$300,000
    directRefs: 20,
    share: 100, // 0.01% daily
  },
  {
    id: 7,
    personalInvestment: "Whitelist", // Whitelist only
    directInvestment: "N/A",
    directRefs: "N/A",
    share: 200, // 0.02% daily
  },
  {
    id: 8,
    personalInvestment: "Whitelist", // Whitelist only
    directInvestment: "N/A",
    directRefs: "N/A",
    share: 200, // 0.02% daily
  },
]

// Adding tokenomics data from documentation
export const TOKENOMICS = {
  totalSupply: 100_000_000_000, // 100B tokens
  distribution: [
    {
      name: "Airdrop Campaign",
      allocation: 29714285714,
      percentage: 29.7,
      purpose: "Distributed over 6 years (daily rewards)",
      maxUsdValue: 52000000,
    },
    {
      name: "Presale & Referral",
      allocation: 5000000000,
      percentage: 5.0,
      purpose: "Fundraising + 10% token bonus for referrals",
      maxUsdValue: 8750000,
    },
    {
      name: "DEX Liquidity",
      allocation: 5000000000,
      percentage: 5.0,
      purpose: "Initial liquidity on DEX (locked for 3 years)",
      maxUsdValue: 8750000,
    },
    {
      name: "Treasury",
      allocation: 10000000000,
      percentage: 10.0,
      purpose: "Ecosystem development, team, operational costs",
      maxUsdValue: 17500000,
    },
    {
      name: "CEX & Marketing",
      allocation: 20000000000,
      percentage: 20.0,
      purpose: "Listings, influencer marketing, promotions, market making",
      maxUsdValue: 35000000,
    },
    {
      name: "Reserve",
      allocation: 30285714286,
      percentage: 30.3,
      purpose: "Flexible reserve for burning, DAO rewards, staking, governance",
      maxUsdValue: 53000000,
    },
  ],
}
