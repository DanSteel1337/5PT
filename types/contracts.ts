export interface PoolInfo {
  id: bigint
  name: string
  description: string
  totalValueLocked: bigint
  apy: bigint
  minInvestment: bigint
  lockPeriod: bigint
  isActive: boolean
}

export interface InvestorInfo {
  poolIds: bigint[]
  amounts: bigint[]
  joinTimestamps: bigint[]
  totalInvested: bigint
  pendingRewards: bigint
}

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
}

export enum TransactionStatus {
  IDLE = "IDLE",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface TransactionState {
  status: TransactionStatus
  hash?: `0x${string}`
  error?: Error
}
