export const TOKEN_ABI = [
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
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
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
] as const

// Investment Manager ABI
export const INVESTMENT_MANAGER_ABI = [
  {
    inputs: [],
    name: "getTotalDeposits",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeePercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDepositDelay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolCriteria",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "minDeposit", type: "uint256" },
          { internalType: "uint256", name: "maxDeposit", type: "uint256" },
          { internalType: "uint256", name: "rewardRate", type: "uint256" },
          { internalType: "uint256", name: "lockPeriod", type: "uint256" },
        ],
        internalType: "struct IInvestmentManager.PoolCriteria",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserInfo",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "depositAmount", type: "uint256" },
          { internalType: "uint256", name: "depositTime", type: "uint256" },
          { internalType: "uint256", name: "lastRewardTime", type: "uint256" },
          { internalType: "uint256", name: "totalRewards", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" },
        ],
        internalType: "struct IInvestmentManager.UserInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "calculateReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "referrer", type: "address" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
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
  {
    inputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "getPoolCriteriaById",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "minDeposit", type: "uint256" },
          { internalType: "uint256", name: "rewardRate", type: "uint256" },
          { internalType: "uint256", name: "lockPeriod", type: "uint256" },
          { internalType: "uint256", name: "maxCapacity", type: "uint256" },
          { internalType: "uint256", name: "personalInvestRequired", type: "uint256" },
          { internalType: "uint256", name: "directRefsRequired", type: "uint256" },
          { internalType: "uint256", name: "totalDirectInvestRequired", type: "uint256" },
        ],
        internalType: "struct IInvestmentManager.PoolCriteria",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "getPoolStats",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalDeposits", type: "uint256" },
          { internalType: "uint256", name: "activeInvestors", type: "uint256" },
        ],
        internalType: "struct IInvestmentManager.PoolStats",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "accountToInvestorInfo",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalDeposit", type: "uint256" },
          { internalType: "uint256", name: "directRefsCount", type: "uint256" },
          { internalType: "uint256", name: "downlineRefsCount", type: "uint256" },
          { internalType: "uint256", name: "directRefsDeposit", type: "uint256" },
          { internalType: "uint256", name: "downlineRefsDeposit", type: "uint256" },
          { internalType: "address", name: "referer", type: "address" },
        ],
        internalType: "struct IInvestmentManager.InvestorInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "poolId", type: "uint256" },
    ],
    name: "isInvestorInPool",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const DEX_ROUTER_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
    ],
    name: "getAmountsOut",
    outputs: [{ internalType: "uint256[]", name: "amounts", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Contract addresses with proper typing
export const CONTRACT_ADDRESSES = {
  token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F" as `0x${string}`, // 5PT Token
  investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc" as `0x${string}`, // Investment Manager
  treasury: "0x17D3846cC570ced5882E41a6a99CB87a8647C0Bb" as `0x${string}`,
  dexRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1" as `0x${string}`,
  priceToken: "0xfb5b838b6cfeedc2873ab27866079ac55363d37e" as `0x${string}`,
  pricePool: "0x231d9e7181e8479a8b40930961e93e7ed798542c" as `0x${string}`,
  wbnb: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" as `0x${string}`,
  referralSystem: "0x1234567890123456789012345678901234567890" as `0x${string}`, // Added missing referral system address
}
