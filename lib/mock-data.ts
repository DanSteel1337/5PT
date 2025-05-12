// Mock token data
export const mockTokenData = {
  name: "Five Pillars Token",
  symbol: "5PT",
  totalSupply: "1000000000",
  circulatingSupply: "750000000",
  price: "0.0025",
  marketCap: "2500000",
  holders: 1250,
  transactions: 8750,
}

// Mock user data
export const mockUserData = {
  balance: "25000",
  investment: "1000",
  earnings: "250",
  referrals: 5,
  referralEarnings: "125",
}

// Mock price history data
export const mockPriceHistory = [
  { date: "2023-01-01", price: 0.001 },
  { date: "2023-02-01", price: 0.0012 },
  { date: "2023-03-01", price: 0.0015 },
  { date: "2023-04-01", price: 0.0018 },
  { date: "2023-05-01", price: 0.002 },
  { date: "2023-06-01", price: 0.0022 },
  { date: "2023-07-01", price: 0.0023 },
  { date: "2023-08-01", price: 0.0024 },
  { date: "2023-09-01", price: 0.0025 },
]

// Mock pools data
export const mockPoolsData = [
  {
    id: 1,
    name: "Staking Pool A",
    apr: "12%",
    lockPeriod: "30 days",
    totalStaked: "250000",
    participants: 120,
  },
  {
    id: 2,
    name: "Staking Pool B",
    apr: "18%",
    lockPeriod: "90 days",
    totalStaked: "500000",
    participants: 85,
  },
  {
    id: 3,
    name: "Staking Pool C",
    apr: "24%",
    lockPeriod: "180 days",
    totalStaked: "750000",
    participants: 50,
  },
]

// Mock transactions
export const mockTransactions = [
  {
    id: "tx1",
    type: "Buy",
    amount: "5000",
    date: "2023-09-15",
    status: "Completed",
  },
  {
    id: "tx2",
    type: "Stake",
    amount: "2500",
    date: "2023-09-16",
    status: "Completed",
  },
  {
    id: "tx3",
    type: "Referral Bonus",
    amount: "250",
    date: "2023-09-17",
    status: "Completed",
  },
  {
    id: "tx4",
    type: "Unstake",
    amount: "1000",
    date: "2023-09-18",
    status: "Pending",
  },
]

// Mock referrals
export const mockReferrals = [
  {
    id: "ref1",
    address: "0xAb5801a7D398351b8bE11C439e05C5B3259cb825",
    earnings: 125.5,
  },
  {
    id: "ref2",
    address: "0x4e84539335211179975041b74484b2b35599ca96",
    earnings: 80.0,
  },
  {
    id: "ref3",
    address: "0x517E429624c7519906A9ca94a3f57a44133c5c99",
    earnings: 55.25,
  },
  {
    id: "ref4",
    address: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    earnings: 30.75,
  },
  {
    id: "ref5",
    address: "0xFFcf8FDEE72ac11b5c542428B35EE570a77805a2",
    earnings: 15.0,
  },
]

// Mock investment data
export const mockInvestmentData = {
  totalInvested: "5000000",
  totalRewards: "750000",
  averageAPR: "18%",
  activeInvestors: 850,
}

// Mock timeframe data for charts
export const mockTimeframeData = {
  "7d": mockPriceHistory.slice(-7),
  "30d": mockPriceHistory.slice(-30),
  "90d": mockPriceHistory.slice(-90),
  "1y": mockPriceHistory,
}

export const mockUserInvestment = {
  totalInvested: 10000,
  rewards: 500,
  lastDeposit: "2024-01-15",
  lastClaim: "2024-01-22",
  roi: 5,
  apy: 26.5,
  stakingPeriod: 30,
}

export const mockTokenMetadata = {
  address: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
  name: "Five Pillars Token",
  symbol: "5PT",
  decimals: "18",
  logo: "/images/5pt-logo.png",
  thumbnail: "/images/5pt-logo.png",
}

export const mockTokenPrice = {
  usdPrice: 0.005,
}

export const mockTokenHolders = [
  {
    token_address: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
    address: "0xAb5801a7D398351b8bE11C439e05C5B3259cb825",
    balance: "1000000000000000000000",
    block_number: "1234567",
    block_timestamp: "2024-01-26T00:00:00Z",
  },
  {
    token_address: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
    address: "0x4e84539335211179975041b74484b2b35599ca96",
    balance: "500000000000000000000",
    block_number: "1234568",
    block_timestamp: "2024-01-27T00:00:00Z",
  },
]

export const mockTokenTransfers = [
  {
    transaction_hash: "0x1234567890abcdef",
    address: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
    block_timestamp: "2024-01-28T00:00:00Z",
    block_number: "1234569",
    block_hash: "0xabcdef1234567890",
    to_address: "0xAb5801a7D398351b8bE11C439e05C5B3259cb825",
    from_address: "0x4e84539335211179975041b74484b2b35599ca96",
    value: "100000000000000000000",
    transaction_index: 1,
    log_index: 1,
  },
  {
    transaction_hash: "0x9876543210fedcba",
    address: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
    block_timestamp: "2024-01-29T00:00:00Z",
    block_number: "1234570",
    block_hash: "0xbafedcba9876543210",
    to_address: "0x4e84539335211179975041b74484b2b35599ca96",
    from_address: "0xAb5801a7D398351b8bE11C439e05C5B3259cb825",
    value: "50000000000000000000",
    transaction_index: 2,
    log_index: 2,
  },
]

export const mockPairReserves = {
  reserve0: "1000000000000000000000000",
  reserve1: "500000000000000000000",
  reserve0_formatted: "1000000",
  reserve1_formatted: "500",
  totalSupply: "1000000000000000000000000",
}
