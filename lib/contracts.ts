/**
 * @file contracts.ts
 * @description Smart contract configuration for the 5PT Investment Platform
 *
 * This file contains contract addresses, ABIs, and constants for interacting
 * with the 5PT Investment Platform smart contracts. It provides type-safe
 * definitions for contract interactions and configuration data.
 *
 * @dependencies
 * - wagmi: Used for typed contract ABIs
 *
 * @related
 * - hooks/useContract.ts: Uses these definitions for contract interactions
 * - components/web3/InvestmentForm.tsx: Uses contract constants
 */

import type { ContractAddresses, ContractConstants, PoolConfig, PoolCriteria, Tokenomics } from "@/types/contracts"

/**
 * Contract addresses for different networks
 *
 * IMPORTANT: Always use chain IDs as keys (56 for BSC Mainnet, 97 for BSC Testnet)
 * NEVER use named properties like "mainnet" or "testnet"
 */
export const CONTRACT_ADDRESSES: ContractAddresses = {
  // BSC Testnet addresses
  97: {
    token: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    investmentManager: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
  // BSC Mainnet addresses
  56: {
    token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
    investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc",
  },
}

/**
 * ERC20 Token ABI
 *
 * Contains the standard ERC20 functions and events needed for token interactions
 */
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

/**
 * Investment Manager ABI
 *
 * Contains the functions and events for interacting with the 5PT Investment Manager contract
 */
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

/**
 * System constants for the 5PT Investment Platform
 *
 * These constants are used for calculations and validations
 */
export const CONTRACT_CONSTANTS: ContractConstants = {
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

/**
 * Pool configuration data
 *
 * Contains information about each investment pool
 */
export const POOLS: PoolConfig[] = [
  {
    id: 0,
    name: "Starter Pool",
    minDeposit: 100,
    maxDeposit: 1000,
    dailyRewardRate: 0.3, // 0.3% daily
    rankRequirement: 0, // Novice rank
  },
  {
    id: 1,
    name: "Growth Pool",
    minDeposit: 500,
    maxDeposit: 5000,
    dailyRewardRate: 0.5, // 0.5% daily
    rankRequirement: 2, // Adept rank
  },
  {
    id: 2,
    name: "Advanced Pool",
    minDeposit: 1000,
    maxDeposit: 10000,
    dailyRewardRate: 0.7, // 0.7% daily
    rankRequirement: 4, // Master rank
  },
  {
    id: 3,
    name: "Elite Pool",
    minDeposit: 5000,
    maxDeposit: 50000,
    dailyRewardRate: 1.0, // 1.0% daily
    rankRequirement: 6, // Legend rank
  },
]

/**
 * Pool qualification criteria from documentation
 *
 * Contains the requirements for qualifying for each pool
 */
export const POOL_CRITERIA: PoolCriteria[] = [
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

/**
 * Tokenomics data for the 5PT token
 *
 * Contains information about token distribution and allocation
 */
export const TOKENOMICS: Tokenomics = {
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
