import { parseUnits } from "viem"

/**
 * Mock data for the 5PT dashboard
 * Used in preview environments where blockchain connections are not available
 */

// Token data
export const mockTokenData = {
  decimals: 18n,
  totalSupply: parseUnits("1000000000", 18),
  price: 0.01,
  priceChange: 5.2,
  marketCap: 10000000,
  liquidity: 2500000,
}

// User data
export const mockUserData = {
  address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
  isConnected: true,
  balance: parseUnits("25000", 18),
  invested: parseUnits("10000", 18),
  rewards: parseUnits("500", 18),
  referrals: 5,
  referralRewards: parseUnits("250", 18),
}

// Investment data
export const mockInvestmentData = {
  totalDeposits: parseUnits("5000000", 18),
  totalRewards: parseUnits("250000", 18),
  poolCriteria: [
    parseUnits("1000", 18), // minimum deposit
    500n, // reward rate (5.00%)
    30n, // lock period in days
  ],
}

// Generate mock price history data
export const generateMockPriceHistory = (days: number, startPrice: number = mockTokenData.price, volatility = 0.05) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000)
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility
    const price = startPrice * randomFactor
    return {
      date: date.toISOString().split("T")[0],
      price,
    }
  })
}

// Mock price history for different timeframes
export const mockPriceHistory = {
  "7d": generateMockPriceHistory(7, mockTokenData.price, 0.05),
  "30d": generateMockPriceHistory(30, mockTokenData.price * 0.8, 0.1),
  "90d": generateMockPriceHistory(90, mockTokenData.price * 0.5, 0.2),
  "1y": generateMockPriceHistory(365, mockTokenData.price * 0.1, 0.5),
}

// Mock pair reserves
export const mockPairReserves = {
  reserve0: "1000000000000000000000",
  reserve1: "5000000000000000000000",
  reserve0_formatted: "1000",
  reserve1_formatted: "5000",
  totalSupply: "2236067977499789696409",
}

// Token distribution data
export const mockDistributionData = [
  { name: "Liquidity", value: 30 },
  { name: "Treasury", value: 25 },
  { name: "Team", value: 15 },
  { name: "Marketing", value: 10 },
  { name: "Development", value: 10 },
  { name: "Community", value: 10 },
]

// Mock pools data
export const mockPoolsData = [1, 2, 3].map((poolId) => ({
  id: poolId,
  name: `Pool ${poolId}`,
  minDeposit: 1000 * poolId,
  rewardRate: (0.5 * poolId).toFixed(1),
  lockPeriod: 7 * poolId,
  annualYield: (26 * poolId).toFixed(1),
  capacity: 65 - poolId * 15,
  isPopular: poolId === 1,
}))

// Mock transactions
export const mockTransactions = Array.from({ length: 3 }, (_, i) => ({
  id: `tx-${i}`,
  type: "Transfer",
  amount: "1,000 5PT",
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
}))
