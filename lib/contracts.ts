/**
 * @file contracts.ts
 * @description Contract addresses and constants
 */

// Chain IDs
export const BSC_MAINNET_ID = 56
export const BSC_TESTNET_ID = 97

// Contract addresses by chain ID
export const CONTRACT_ADDRESSES = {
  [BSC_MAINNET_ID]: {
    token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
    investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc",
  },
  [BSC_TESTNET_ID]: {
    token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
    investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc",
  },
}

// Token and Investment Manager addresses
export const TOKEN_ADDRESS = "0x8FafdFB035C9426a50D842873D5d401C933bE09F"
export const INVESTMENT_MANAGER_ADDRESS = "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc"

/**
 * System constants for the 5PT Investment Platform
 * These constants are used for calculations and validations
 */
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

// Pool qualification criteria
export const POOL_CRITERIA = [
  {
    id: 0,
    personalInvestment: "1000000000000000000000", // 1,000 5PT
    directRefs: 5,
    directInvestment: "5000000000000000000000", // 5,000 5PT
    share: 175, // 0.0175%
  },
  {
    id: 1,
    personalInvestment: "2500000000000000000000", // 2,500 5PT
    directRefs: 10,
    directInvestment: "15000000000000000000000", // 15,000 5PT
    share: 175, // 0.0175%
  },
  {
    id: 2,
    personalInvestment: "5000000000000000000000", // 5,000 5PT
    directRefs: 15,
    directInvestment: "30000000000000000000000", // 30,000 5PT
    share: 175, // 0.0175%
  },
  {
    id: 3,
    personalInvestment: "10000000000000000000000", // 10,000 5PT
    directRefs: 20,
    directInvestment: "50000000000000000000000", // 50,000 5PT
    share: 175, // 0.0175%
  },
  {
    id: 4,
    personalInvestment: "25000000000000000000000", // 25,000 5PT
    directRefs: 25,
    directInvestment: "100000000000000000000000", // 100,000 5PT
    share: 175, // 0.0175%
  },
  {
    id: 5,
    personalInvestment: "50000000000000000000000", // 50,000 5PT
    directRefs: 30,
    directInvestment: "250000000000000000000000", // 250,000 5PT
    share: 100, // 0.01%
  },
  {
    id: 6,
    personalInvestment: "100000000000000000000000", // 100,000 5PT
    directRefs: 35,
    directInvestment: "500000000000000000000000", // 500,000 5PT
    share: 100, // 0.01%
  },
  {
    id: 7,
    personalInvestment: "250000000000000000000000", // 250,000 5PT
    directRefs: 40,
    directInvestment: "1000000000000000000000000", // 1,000,000 5PT
    share: 200, // 0.02%
  },
  {
    id: 8,
    personalInvestment: "500000000000000000000000", // 500,000 5PT
    directRefs: 50,
    directInvestment: "2500000000000000000000000", // 2,500,000 5PT
    share: 200, // 0.02%
  },
]

/**
 * Tokenomics data for the 5PT token
 * Contains information about token distribution and allocation
 */
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

// Get contract address by chain ID and contract name
export function getContractAddress(chainId: number, contractName: string): string {
  if (!CONTRACT_ADDRESSES[chainId] || !CONTRACT_ADDRESSES[chainId][contractName]) {
    throw new Error(`Contract address not found for ${contractName} on chain ${chainId}`)
  }
  return CONTRACT_ADDRESSES[chainId][contractName]
}

/**
 * @file abis.ts
 * @description Contract ABIs for the 5PT Investment Platform
 */

// ERC20 Token ABI
export const TOKEN_ABI = [
  // ERC20 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint amount) returns (bool)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint amount)",
] as const

// Investment Manager ABI
export const INVESTMENT_MANAGER_ABI = [
  // View functions
  "function getInvestorData(address investor) view returns (uint256 totalDeposited, uint256 totalReinvested, uint256 totalWithdrawn, uint256 lastActionTimestamp)",
  "function getPoolData(uint256 poolId) view returns (string name, uint256 minDeposit, uint256 maxDeposit, uint256 dailyRewardRate, uint256 totalDeposited)",
  "function getAvailableRewards(address investor) view returns (uint256)",
  "function getReferralData(address referrer) view returns (address[] referrals, uint256 totalCommission)",
  "function getUserRank(address user) view returns (uint256)",
  "function isQualifiedForPool(address user, uint256 poolId) view returns (bool)",
  // Transaction functions
  "function deposit(uint256 poolId, uint256 amount, address referrer) returns (bool)",
  "function withdraw() returns (uint256)",
  "function reinvest() returns (bool)",
  "function claimReferralCommission() returns (uint256)",
  // Events
  "event Deposit(address indexed user, uint256 indexed poolId, uint256 amount, address indexed referrer)",
  "event Withdrawal(address indexed user, uint256 amount)",
  "event ReferralCommission(address indexed referrer, address indexed referee, uint256 amount)",
  "event RankUpdated(address indexed user, uint256 newRank)",
] as const
