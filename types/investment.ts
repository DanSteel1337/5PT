export interface ProjectedEarnings {
  hourly: number
  daily: number
  weekly: number
  monthly: number
  yearly: number
}

export interface PoolInfo {
  id: number
  name: string
  dailyRate: number
  minDeposit: number
  lockPeriod: number
  totalStaked: number
  isWhitelisted: boolean
}

export interface InvestmentDataContextType {
  // User data
  userTotalDeposits: number
  userPoolRewards: number
  userReferralBonus: number
  userReferralCount: number
  userRank: number
  userTokenBalance: number

  // Pool data
  pools: PoolInfo[]
  userPoolEligibility: boolean[]

  // Calculation results
  dailyRatePercent: number
  projectedDailyYield: number
  projectedEarnings: ProjectedEarnings

  // Token info
  tokenSymbol: string
  tokenDecimals: number

  // Status
  isLoading: boolean
  isError: boolean
  error: Error | null
  isConnected: boolean

  // Actions
  refetch: () => Promise<void>
}

export interface InvestmentData {
  isConnected: boolean
  userRank: number
  userTotalDeposits: number
  userReferralBonus: number
  userReferralCount: number
  userPoolRewards: number
  userDirectReferralVolume: number
  userReferralVolume: number
  totalInvestors: number
  totalValueLocked: number
  tokenSymbol: string
  userTokenBalance: number
  projectedDailyYield: number
  projectedWeeklyYield: number
  projectedMonthlyYield: number
  projectedAnnualYield: number
  dailyRatePercent: number
  accumulatedRewards: number
  lastRoundRewards: {
    dailyReward: number
    refReward: number
    poolsReward: number
  } | null
  poolEligibility: boolean[]
  isLoading: boolean
}
