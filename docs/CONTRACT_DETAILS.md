# Five Pillars Token (5PT) Contract Details

This document provides detailed information about the Five Pillars Token (5PT) smart contracts and their integration with our DApp.

## Deployed Contracts

- **Investment Manager Contract**: `0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc`
- **Token Contract**: `0x8FafdFB035C9426a50D842873D5d401C933bE09F`

## Token Contract

The Five Pillars Token (5PT) is an ERC20 token that serves as the utility token for the platform.

### Key Properties

| Property | Value |
|----------|-------|
| Name | Five Pillars Token (formerly Solarius Network Token) |
| Symbol | 5PT (formerly SOLS) |
| Decimals | 18 |
| Total Supply | 100,000,000,000 (100B) tokens |

### Tokenomics

| Category | Allocation (Tokens) | % of Supply | Purpose | Max USD Value |
|----------|---------------------|------------|---------|---------------|
| Airdrop Campaign | 29,714,285,714 | 29.7% | $52M in tokens distributed over 6 years (daily rewards) | $52,000,000 |
| Presale + Referral | 5,000,000,000 | 5.0% | Fundraising ($500K–$9M) + 10% token bonus for referrals | $8,750,000 |
| DEX Liquidity (Locked) | 5,000,000,000 | 5.0% | Initial liquidity on DEX (locked for 3 years) | $8,750,000 |
| Treasury | 10,000,000,000 | 10.0% | Ecosystem development, team, operational costs | $17,500,000 |
| CEX / Marketing | 20,000,000,000 | 20.0% | Listings, influencer marketing, promotions, market making | $35,000,000 |
| Reserve (Burn, DAO, etc.) | 30,285,714,286 | 30.3% | Flexible reserve for burning, DAO rewards, staking, governance | $53,000,000 |

## Investment Manager Contract

The Investment Manager contract handles deposits, rewards distribution, referral system, and investment pools.

### Key Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `BASIS_POINTS` | 1,000,000 | Base for percentage calculations |
| `roundDuration` | 3,600 seconds (1 hour) | Duration of each reward round |
| `depositDelay` | 14,400 seconds (4 hours) | Minimum time between deposits |
| `poolCriteriaUpdateDelay` | 108,000 seconds (30 hours) | Minimum time between pool criteria updates |

## Global Yield System

The system is based on a dynamic combination of daily bonuses and pool incentives:

### Components

1. **Daily Bonus**:
   - Earn 0.35% daily on your invested capital
   - No team tokens—system designed for investors, not insiders

2. **First-Level Daily Deposit Bonus**:
   - Gain an additional 0.05% daily bonus on deposits made by direct referrals

3. **Daily Downline Bonus**:
   - Receive 0.0135% per level (up to levels 2–10)

4. **Daily Pool Bonus**:
   - Nine pools filled daily with a percentage of the total deposit volume
   - Pools 1-5: 0.035% each
   - Pools 6-9: 0.02% each

### Pool Participation Criteria

| Pool ID | Personal Investment Required | Total Direct Investment Required | Direct Refs Required | Share |
|---------|------------------------------|----------------------------------|----------------------|-------|
| 0 | 550 * 10^18 (~$1,000) | 550 * 10^18 (~$1,000) | 1 | 350 |
| 1 | 145 * 10^19 (~$2,500) | 145 * 10^19 (~$2,500) | 3 | 350 |
| 2 | 3 * 10^21 (~$5,000) | 6 * 10^21 (~$10,000) | 5 | 350 |
| 3 | 55 * 10^20 (~$10,000) | 11 * 10^21 (~$20,000) | 10 | 350 |
| 4 | 1425 * 10^19 (~$25,000) | 285 * 10^20 (~$50,000) | 15 | 350 |
| 5 | 285 * 10^20 (~$50,000) | 855 * 10^20 (~$150,000) | 20 | 200 |
| 6 | 57 * 10^21 (~$100,000) | 171 * 10^21 (~$300,000) | 20 | 200 |
| 7 | Whitelist only | N/A | N/A | 200 |
| 8 | Whitelist only | N/A | N/A | 200 |

## Fee Structure

### Claim Tax System
- 10% claim tax on all reward claims
- Distribution:
  - 70% of tax sent to treasury address #1
  - 30% of tax sent to treasury address #2
  - Remaining amount (after tax) is split:
    - 50% to user's wallet
    - 50% automatically reinvested

### Deposit Tax System
- 10% deposit tax on all deposits
- Distribution:
  - 70% of tax sent to treasury address #1
  - 30% of tax sent to treasury address #2

## Core Functions

### Deposit
- Minimum deposit: 1 token
- No maximum limit
- Requires waiting period between deposits (4 hours)
- Includes referral tracking functionality
- Deposit tax (0-10%) is applied and distributed to treasuries

### Claim Rewards
- Minimum claim amount: 1 token
- Claim tax (0-10%) is applied and distributed to treasuries
- 50% of post-tax rewards go to wallet, 50% automatically reinvested

## Technical Integration

The contract can be integrated with standard Web3 libraries:

- Use `accountToInvestorInfo(address)` to get a user's investment data
- Use `isInvestorInPool(address, uint8)` to check pool eligibility
- Use `getAccumulatedRewards()` to view pending rewards
- Use `getLastRoundRewards()` to see reward breakdown
