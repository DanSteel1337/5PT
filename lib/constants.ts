// Contract addresses
export const CONTRACT_ADDRESSES = {
  token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F",
  investmentManager: "", // To be updated after deployment
  treasury: "0x17D3846cC570ced5882E41a6a99CB87a8647C0Bb",
  dexRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
}

// Contract ABIs
export const TOKEN_ABI = [
  // ERC20 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  // Custom functions
  "function mint(address account, uint256 amount)",
  "function burnFrom(address account, uint256 amount)",
  "function setInvestmentManager(address manager)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
]

export const INVESTMENT_MANAGER_ABI = [
  // View functions
  "function getAccumulatedRewards() view returns (uint256)",
  "function getLastRoundRewards() view returns (uint256 dailyReward, uint256 refReward, uint256 poolsReward)",
  "function getInvestorInfo(address investor) view returns (tuple(uint256 totalDeposit, uint128 directRefsCount, uint128 downlineRefsCount, uint256 directRefsDeposit, uint256 downlineRefsDeposit, address referer, uint256 lastDailyReward, uint256 lastRefReward, uint256 accumulatedReward, uint32 lastClaimTimestamp, uint32 lastDepositTimestamp, uint32 updateRefRewardTimestamp))",
  "function getInvestorPoolRewardPerTokenPaid(address investor, uint8 poolId) view returns (uint256)",
  "function getPoolInfo(uint8 poolId) view returns (tuple(bool isActive, uint256 curReward, uint256 lastReward, uint256 participantsCount, uint256 rewardPerInvestorStored, uint128 personalInvestRequired, uint128 totalDirectInvestRequired, uint8 directRefsRequired, uint16 share))",
  "function isInvestorInPool(address investor, uint8 poolId) view returns (bool)",
  // Write functions
  "function deposit(uint256 amount, address referer)",
  "function claimReward()",
  // Events
  "event Deposit(address investor, address referer, uint256 amount)",
  "event ClaimReward(address investor, uint256 amount)",
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
