/**
 * Types for contract data and interactions
 */

// Contract address mapping by chain ID
export interface ContractAddresses {
  [chainId: number]: {
    token: string
    investmentManager: string
  }
}

// Token distribution data
export interface TokenDistribution {
  name: string
  allocation: number
  percentage: number
  purpose: string
  maxUsdValue: number
}

// Tokenomics data
export interface Tokenomics {
  totalSupply: number
  distribution: TokenDistribution[]
}

// Pool criteria data
export interface PoolCriteria {
  id: number
  personalInvestment: number | string
  directInvestment: number | string
  directRefs: number | string
  share: number
}

// Pool configuration data
export interface PoolConfig {
  id: number
  name: string
  minDeposit: number
  maxDeposit: number
  dailyRewardRate: number
  rankRequirement: number
}

// Contract constants
export interface ContractConstants {
  BASIS_POINTS: number
  ROUND_DURATION: number
  DEPOSIT_DELAY: number
  POOL_CRITERIA_UPDATE_DELAY: number
  CLAIM_TAX_PERCENT: number
  DEPOSIT_TAX_PERCENT: number
  MIN_DEPOSIT: number
  TOKEN_DECIMALS: number
  TOTAL_SUPPLY: number
}

// Investor data from contract
export interface InvestorData {
  totalDeposited: bigint
  totalReinvested: bigint
  totalWithdrawn: bigint
  lastActionTimestamp: bigint
}

// Pool data from contract
export interface PoolData {
  name: string
  minDeposit: bigint
  maxDeposit: bigint
  dailyRewardRate: bigint
  totalDeposited: bigint
}

// Referral data from contract
export interface ReferralData {
  referrals: string[]
  totalCommission: bigint
}
