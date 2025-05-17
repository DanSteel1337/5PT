/**
 * @file abis.ts
 * @description Contract ABIs for the 5PT Investment Platform
 */

// ERC20 Token ABI
export const TOKEN_ABI = [
  // ERC20 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint amount) returns (bool)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint amount)",
] as const

// Investment Manager ABI
export const INVESTMENT_MANAGER_ABI = [
  // View functions
  "function getInvestorData(address investor) view returns (uint256 totalDeposited, uint256 totalReinvested, uint256 totalWithdrawn, uint256 lastActionTimestamp)",
  "function getPoolData(uint256 poolId) view returns (string name, uint256 minDeposit, uint256 maxDeposit, uint256 dailyRewardRate, uint256 totalDeposited)",
  "function getAvailableRewards(address investor) view returns (uint256)",
  "function getReferralData(address referrer) view returns (address[] referrals, uint256 totalCommission)",
  "function getUserRank(address user) view returns (uint256)",
  "function isQualifiedForPool(address user, uint256 poolId) view returns (bool)",
  // Transaction functions
  "function deposit(uint256 poolId, uint256 amount, address referrer) returns (bool)",
  "function withdraw() returns (uint256)",
  "function reinvest() returns (bool)",
  "function claimReferralCommission() returns (uint256)",
  // Events
  "event Deposit(address indexed user, uint256 indexed poolId, uint256 amount, address indexed referrer)",
  "event Withdrawal(address indexed user, uint256 amount)",
  "event ReferralCommission(address indexed referrer, address indexed referee, uint256 amount)",
  "event RankUpdated(address indexed user, uint256 newRank)",
] as const
