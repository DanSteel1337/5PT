export const INVESTMENT_MANAGER_ABI = [
  {
    inputs: [],
    name: "getAvailablePools",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalValueLocked",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "apy",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lockPeriod",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct InvestmentManager.PoolInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "getPoolDetails",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalValueLocked",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "apy",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lockPeriod",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct InvestmentManager.PoolInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "getInvestorInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256[]",
            name: "poolIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "joinTimestamps",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "totalInvested",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pendingRewards",
            type: "uint256",
          },
        ],
        internalType: "struct InvestmentManager.InvestorInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "investInPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "withdrawFromPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
