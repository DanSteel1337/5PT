export const INVESTMENT_MANAGER_ABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserRank",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserTotalDeposits",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserReferralBonus",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserReferralCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserPoolRewards",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalInvestors",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalValueLocked",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
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
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserReferrals",
    outputs: [{ name: "", type: "address[]" }],
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
] as const

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

export function getContractAddress(contract: string, chainId: number): `0x${string}` {
  const addresses: Record<string, Record<number, `0x${string}`>> = {
    fivePillarsToken: {
      56: CONTRACT_ADDRESSES.mainnet.fivePillarsToken,
      97: CONTRACT_ADDRESSES.testnet.fivePillarsToken,
    },
    investmentManager: {
      56: CONTRACT_ADDRESSES.mainnet.investmentManager,
      97: CONTRACT_ADDRESSES.testnet.investmentManager,
    },
  }

  return addresses[contract]?.[chainId] || ("0x0000000000000000000000000000000000000000" as `0x${string}`)
}

export const CONTRACT_CONSTANTS = {
  BASIS_POINTS: 1000000,
  ROUND_DURATION: 86400,
  DEPOSIT_DELAY: 14400,
  POOL_CRITERIA_UPDATE_DELAY: 108000,
  CLAIM_TAX_PERCENT: 10,
  DEPOSIT_TAX_PERCENT: 10,
  MIN_DEPOSIT: 1 * 10 ** 18,
  TOKEN_DECIMALS: 18,
  TOTAL_SUPPLY: 100_000_000_000 * 10 ** 18,
}

export const TOKENOMICS = {
  totalSupply: 10_000_000_000 * 10 ** 18,
  airdropCampaign: {
    allocation: 29714285714,
    percentage: 29.7,
    purpose: "Distributed over 6 years (daily rewards)",
    maxUsdValue: 52000000,
  },
  presaleAndReferral: {
    allocation: 5000000000,
    percentage: 5.0,
    purpose: "Fundraising + 10% token bonus for referrals",
    maxUsdValue: 8750000,
  },
  dexLiquidity: {
    allocation: 5000000000,
    percentage: 5.0,
    purpose: "Initial liquidity on DEX (locked for 3 years)",
    maxUsdValue: 8750000,
  },
  treasury: {
    allocation: 10000000000,
    percentage: 10.0,
    purpose: "Ecosystem development, team, operational costs",
    maxUsdValue: 17500000,
  },
  cexAndMarketing: {
    allocation: 20000000000,
    percentage: 20.0,
    purpose: "Listings, influencer marketing, promotions, market making",
    maxUsdValue: 35000000,
  },
  reserve: {
    allocation: 30285714286,
    percentage: 30.3,
    purpose: "Flexible reserve for burning, DAO rewards, staking, governance",
    maxUsdValue: 53000000,
  },
}

export const REWARD_SYSTEM = {
  dailyBonus: 0.008,
  referralBonus: 0.05,
  poolRewards: [0.001, 0.002, 0.003, 0.004, 0.005],
}

export const POOL_CRITERIA = [
  {
    id: 0,
    personalInvestment: 550 * 10 ** 18,
    directInvestment: 550 * 10 ** 18,
    directRefs: 1,
    share: 175,
  },
  {
    id: 1,
    personalInvestment: 145 * 10 ** 19,
    directInvestment: 145 * 10 ** 19,
    directRefs: 3,
    share: 175,
  },
  {
    id: 2,
    personalInvestment: 3 * 10 ** 21,
    directInvestment: 6 * 10 ** 21,
    directRefs: 5,
    share: 175,
  },
  {
    id: 3,
    personalInvestment: 55 * 10 ** 20,
    directInvestment: 11 * 10 ** 21,
    directRefs: 10,
    share: 175,
  },
  {
    id: 4,
    personalInvestment: 1425 * 10 ** 19,
    directInvestment: 285 * 10 ** 20,
    directRefs: 15,
    share: 175,
  },
  {
    id: 5,
    personalInvestment: 285 * 10 ** 20,
    directInvestment: 855 * 10 ** 20,
    directRefs: 20,
    share: 100,
  },
  {
    id: 6,
    personalInvestment: 57 * 10 ** 21,
    directInvestment: 171 * 10 ** 21,
    directRefs: 20,
    share: 100,
  },
  {
    id: 7,
    personalInvestment: "Whitelist",
    directInvestment: "N/A",
    directRefs: "N/A",
    share: 200,
  },
  {
    id: 8,
    personalInvestment: "Whitelist",
    directInvestment: "N/A",
    directRefs: "N/A",
    share: 200,
  },
]

export const contracts = {
  investmentManager: {
    address: CONTRACT_ADDRESSES.mainnet.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
  },
  token: {
    address: CONTRACT_ADDRESSES.mainnet.fivePillarsToken,
    abi: TOKEN_ABI,
  },
}
