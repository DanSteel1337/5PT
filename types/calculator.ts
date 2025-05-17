import type React from "react"
/**
 * Types for the investment calculator component
 */

// Pool data structure
export interface PoolData {
  id: number
  name: string
  personalInvestRequired: number
  totalDirectInvestRequired: number
  directRefsRequired: number
  share: number
  usdValuePersonal: number
  usdValueDirect: number
  whitelistOnly?: boolean
}

// Feature data structure
export interface FeatureData {
  icon: React.ReactNode
  title: string
  description: string
  points: string[]
}

// Daily result data structure
export interface DailyResult {
  day: number
  investment: number
  dailyReward: number
  baseReward: number
  poolRewards: number
  referralReward: number
  downlineReward: number
}

// Calculation result data structure
export interface CalculationResult {
  initialInvestment: number
  afterTaxInvestment: number
  currentInvestment: number
  totalEarnings: number
  totalReinvested: number
  totalClaimed: number
  dailyResults: DailyResult[]
  depositTaxPaid: number
  roi: number
  eligiblePools: number[]
}
