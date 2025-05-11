// Contract addresses
export const CONTRACT_ADDRESSES = {
  token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F", // Correct token address
  investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc", // Updated with correct investment manager address
  treasury: "0x17D3846cC570ced5882E41a6a99CB87a8647C0Bb",
  dexRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
}

// Contract ABIs in proper JSON format for wagmi v2
export const TOKEN_ABI = [
  // ERC20 standard functions
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
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
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
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
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Custom functions
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "manager", type: "address" }],
    name: "setInvestmentManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
]

export const INVESTMENT_MANAGER_ABI = [
  // View functions
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
    outputs: [
      { internalType: "uint256", name: "dailyReward", type: "uint256" },
      { internalType: "uint256", name: "refReward", type: "uint256" },
      { internalType: "uint256", name: "poolsReward", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "investor", type: "address" }],
    name: "getInvestorInfo",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalDeposit", type: "uint256" },
          { internalType: "uint128", name: "directRefsCount", type: "uint128" },
          { internalType: "uint128", name: "downlineRefsCount", type: "uint128" },
          { internalType: "uint256", name: "directRefsDeposit", type: "uint256" },
          { internalType: "uint256", name: "downlineRefsDeposit", type: "uint256" },
          { internalType: "address", name: "referer", type: "address" },
          { internalType: "uint256", name: "lastDailyReward", type: "uint256" },
          { internalType: "uint256", name: "lastRefReward", type: "uint256" },
          { internalType: "uint256", name: "accumulatedReward", type: "uint256" },
          { internalType: "uint32", name: "lastClaimTimestamp", type: "uint32" },
          { internalType: "uint32", name: "lastDepositTimestamp", type: "uint32" },
          { internalType: "uint32", name: "updateRefRewardTimestamp", type: "uint32" },
        ],
        internalType: "struct InvestmentManager.Investor",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "investor", type: "address" },
      { internalType: "uint8", name: "poolId", type: "uint8" },
    ],
    name: "getInvestorPoolRewardPerTokenPaid",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "poolId", type: "uint8" }],
    name: "getPoolInfo",
    outputs: [
      {
        components: [
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "uint256", name: "curReward", type: "uint256" },
          { internalType: "uint256", name: "lastReward", type: "uint256" },
          { internalType: "uint256", name: "participantsCount", type: "uint256" },
          { internalType: "uint256", name: "rewardPerInvestorStored", type: "uint256" },
          { internalType: "uint128", name: "personalInvestRequired", type: "uint128" },
          { internalType: "uint128", name: "totalDirectInvestRequired", type: "uint128" },
          { internalType: "uint8", name: "directRefsRequired", type: "uint8" },
          { internalType: "uint16", name: "share", type: "uint16" },
        ],
        internalType: "struct InvestmentManager.Pool",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "investor", type: "address" },
      { internalType: "uint8", name: "poolId", type: "uint8" },
    ],
    name: "isInvestorInPool",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "referer", type: "address" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "investor", type: "address" },
      { indexed: true, internalType: "address", name: "referer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "investor", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "ClaimReward",
    type: "event",
  },
]

// Pool IDs
export const POOL_IDS = [0, 1, 2, 3, 4]

// Time constants
export const DAY_IN_SECONDS = 86400
export const HOUR_IN_SECONDS = 3600
export const MINUTE_IN_SECONDS = 60

// UI constants
export const ANIMATION_DURATION = 0.5
export const STAGGER_DELAY = 0.1

// Theme colors
export const THEME = {
  gold: {
    light: "#f5d76e",
    DEFAULT: "#d4af37",
    dark: "#b8860b",
  },
  black: {
    light: "#2a2a2a",
    DEFAULT: "#121212",
    dark: "#000000",
  },
}
