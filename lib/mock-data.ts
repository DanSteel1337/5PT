import { parseUnits } from "viem"

// Mock token data
export const mockTokenData = {
  decimals: 18n,
  totalSupply: parseUnits("100000000", 18),
  price: 0.01,
  symbol: "5PT",
  name: "Five Pillars Token",
}

// Mock user data
export const mockUserData = {
  address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
  isConnected: true,
  balance: parseUnits("10000", 18),
  invested: parseUnits("5000", 18),
  rewards: parseUnits("250", 18),
  referrals: 5,
  referralRewards: parseUnits("250", 18),
}

// Mock investment data
export const mockInvestmentData = {
  totalDeposits: parseUnits("1000000", 18),
  totalRewards: parseUnits("50000", 18),
  poolCriteria: [
    parseUnits("1000", 18), // Minimum deposit
    500n, // Reward rate (5%)
    30n, // Lock period (30 days)
  ],
}

// Mock price history data
export const mockPriceHistory = {
  "7d": Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (7 - i - 1))
    return {
      date: date.toISOString().split("T")[0],
      price: 0.01 * (1 + Math.sin(i / 2) * 0.1),
    }
  }),
  "30d": Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (30 - i - 1))
    return {
      date: date.toISOString().split("T")[0],
      price: 0.01 * (1 + Math.sin(i / 5) * 0.2),
    }
  }),
  "90d": Array.from({ length: 90 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (90 - i - 1))
    return {
      date: date.toISOString().split("T")[0],
      price: 0.01 * (1 + Math.sin(i / 15) * 0.3),
    }
  }),
  "1y": Array.from({ length: 365 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (365 - i - 1))
    return {
      date: date.toISOString().split("T")[0],
      price: 0.01 * (1 + Math.sin(i / 60) * 0.5),
    }
  }),
}

// Mock pair reserves data
export const mockPairReserves = {
  reserve0: "1000000000000000000000",
  reserve1: "5000000000000000000000",
  reserve0_formatted: "1000",
  reserve1_formatted: "5000",
  totalSupply: "2236067977499789696409",
}

// Mock distribution data
export const mockDistributionData = [
  { name: "Liquidity", value: 30 },
  { name: "Treasury", value: 25 },
  { name: "Team", value: 15 },
  { name: "Marketing", value: 10 },
  { name: "Development", value: 10 },
  { name: "Community", value: 10 },
]

// Mock pools data
export const mockPoolsData = [
  {
    id: 1,
    name: "Pool 1",
    minDeposit: "1,000",
    rewardRate: "0.5",
    lockPeriod: "7",
    annualYield: "26.0",
    capacity: 50,
    isPopular: true,
  },
  {
    id: 2,
    name: "Pool 2",
    minDeposit: "2,000",
    rewardRate: "1.0",
    lockPeriod: "14",
    annualYield: "26.0",
    capacity: 35,
    isPopular: false,
  },
  {
    id: 3,
    name: "Pool 3",
    minDeposit: "3,000",
    rewardRate: "1.5",
    lockPeriod: "21",
    annualYield: "26.0",
    capacity: 20,
    isPopular: false,
  },
]

// Mock transactions
export const mockTransactions = [
  {
    id: 1,
    type: "Transfer",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amount: "1,000 5PT",
  },
  {
    id: 2,
    type: "Deposit",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amount: "2,500 5PT",
  },
  {
    id: 3,
    type: "Reward",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amount: "125 5PT",
  },
]
