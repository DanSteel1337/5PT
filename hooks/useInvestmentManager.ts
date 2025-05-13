// hooks/useInvestmentManager.ts
"use client"

import { useReadContract, useWriteContract, useAccount, useChainId } from "wagmi"
import { getContractAddress } from "@/contracts/addresses"
import { INVESTMENT_MANAGER_ABI } from "@/contracts/abis/InvestmentManager"
import { useMemo, useState } from "react"
import { type PoolInfo, TransactionStatus, type TransactionState } from "@/types/contracts"
import { formatUnits, parseUnits } from "viem"
import { 
  ContractFunctionExecutionError,
  UserRejectedRequestError,
  InsufficientFundsError 
} from 'viem'

// Custom hook for investment manager contract interactions
export function useInvestmentManager() {
  const { address } = useAccount()
  const chainId = useChainId()
  const investmentManagerAddress = getContractAddress("investmentManager", chainId)

  // Get all available pools
  function useAvailablePools() {
    return useReadContract({
      address: investmentManagerAddress,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getAvailablePools",
    })
  }

  // Get details for a specific pool
  function usePoolDetails(poolId: bigint | undefined) {
    return useReadContract({
      address: investmentManagerAddress,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getPoolDetails",
      args: poolId !== undefined ? [poolId] : undefined,
      query: {
        enabled: poolId !== undefined,
      },
    })
  }

  // Get investor information
  function useInvestorInfo() {
    return useReadContract({
      address: investmentManagerAddress,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getInvestorInfo",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  // Invest in a pool with enhanced error handling
  function useInvestInPool() {
    const { writeContract, data, error, isPending, isSuccess, isError } = useWriteContract()
    const [state, setState] = useState<TransactionState>({
      status: TransactionStatus.IDLE,
    })

    const invest = async (poolId: bigint, amount: string) => {
      try {
        setState({ status: TransactionStatus.PENDING })

        const amountInWei = parseUnits(amount, 18)

        writeContract({
          address: investmentManagerAddress,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "investInPool",
          args: [poolId, amountInWei],
        })
      } catch (error) {
        console.error("Investment error:", error)
        
        if (error instanceof UserRejectedRequestError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Transaction rejected by user"),
          })
        } else if (error instanceof InsufficientFundsError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Insufficient funds for transaction"),
          })
        } else if (error instanceof ContractFunctionExecutionError) {
          // Try to extract revert reason
          const revertReason = error.message.match(/reverted with reason string '([^']+)'/)
          setState({
            status: TransactionStatus.ERROR,
            error: new Error(revertReason ? revertReason[1] : "Contract execution failed"),
          })
        } else {
          setState({
            status: TransactionStatus.ERROR,
            error: error instanceof Error ? error : new Error("Unknown error"),
          })
        }
      }
    }

    // Update state based on transaction status
    useMemo(() => {
      if (isPending) {
        setState({ status: TransactionStatus.PENDING })
      } else if (isSuccess && data) {
        setState({ status: TransactionStatus.SUCCESS, hash: data })
      } else if (isError && error) {
        if (error instanceof UserRejectedRequestError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Transaction rejected by user"),
          })
        } else if (error instanceof InsufficientFundsError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Insufficient funds for transaction"),
          })
        } else if (error instanceof ContractFunctionExecutionError) {
          // Try to extract revert reason
          const revertReason = error.message.match(/reverted with reason string '([^']+)'/)
          setState({
            status: TransactionStatus.ERROR,
            error: new Error(revertReason ? revertReason[1] : "Contract execution failed"),
          })
        } else {
          setState({
            status: TransactionStatus.ERROR,
            error: error instanceof Error ? error : new Error("Transaction failed"),
          })
        }
      }
    }, [isPending, isSuccess, isError, data, error])

    return { invest, ...state }
  }

  // Withdraw from a pool with enhanced error handling
  function useWithdrawFromPool() {
    const { writeContract, data, error, isPending, isSuccess, isError } = useWriteContract()
    const [state, setState] = useState<TransactionState>({
      status: TransactionStatus.IDLE,
    })

    const withdraw = async (poolId: bigint) => {
      try {
        setState({ status: TransactionStatus.PENDING })

        writeContract({
          address: investmentManagerAddress,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "withdrawFromPool",
          args: [poolId],
        })
      } catch (error) {
        console.error("Withdrawal error:", error)
        
        if (error instanceof UserRejectedRequestError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Transaction rejected by user"),
          })
        } else if (error instanceof InsufficientFundsError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Insufficient funds for transaction"),
          })
        } else if (error instanceof ContractFunctionExecutionError) {
          // Try to extract revert reason
          const revertReason = error.message.match(/reverted with reason string '([^']+)'/)
          setState({
            status: TransactionStatus.ERROR,
            error: new Error(revertReason ? revertReason[1] : "Contract execution failed"),
          })
        } else {
          setState({
            status: TransactionStatus.ERROR,
            error: error instanceof Error ? error : new Error("Unknown error"),
          })
        }
      }
    }

    // Update state based on transaction status
    useMemo(() => {
      if (isPending) {
        setState({ status: TransactionStatus.PENDING })
      } else if (isSuccess && data) {
        setState({ status: TransactionStatus.SUCCESS, hash: data })
      } else if (isError && error) {
        if (error instanceof UserRejectedRequestError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Transaction rejected by user"),
          })
        } else if (error instanceof InsufficientFundsError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Insufficient funds for transaction"),
          })
        } else if (error instanceof ContractFunctionExecutionError) {
          // Try to extract revert reason
          const revertReason = error.message.match(/reverted with reason string '([^']+)'/)
          setState({
            status: TransactionStatus.ERROR,
            error: new Error(revertReason ? revertReason[1] : "Contract execution failed"),
          })
        } else {
          setState({
            status: TransactionStatus.ERROR,
            error: error instanceof Error ? error : new Error("Transaction failed"),
          })
        }
      }
    }, [isPending, isSuccess, isError, data, error])

    return { withdraw, ...state }
  }

  // Claim rewards with enhanced error handling
  function useClaimRewards() {
    const { writeContract, data, error, isPending, isSuccess, isError } = useWriteContract()
    const [state, setState] = useState<TransactionState>({
      status: TransactionStatus.IDLE,
    })

    const claim = async () => {
      try {
        setState({ status: TransactionStatus.PENDING })

        writeContract({
          address: investmentManagerAddress,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "claimRewards",
        })
      } catch (error) {
        console.error("Claim error:", error)
        
        if (error instanceof UserRejectedRequestError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Transaction rejected by user"),
          })
        } else if (error instanceof InsufficientFundsError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Insufficient funds for transaction"),
          })
        } else if (error instanceof ContractFunctionExecutionError) {
          // Try to extract revert reason
          const revertReason = error.message.match(/reverted with reason string '([^']+)'/)
          setState({
            status: TransactionStatus.ERROR,
            error: new Error(revertReason ? revertReason[1] : "Contract execution failed"),
          })
        } else {
          setState({
            status: TransactionStatus.ERROR,
            error: error instanceof Error ? error : new Error("Unknown error"),
          })
        }
      }
    }

    // Update state based on transaction status
    useMemo(() => {
      if (isPending) {
        setState({ status: TransactionStatus.PENDING })
      } else if (isSuccess && data) {
        setState({ status: TransactionStatus.SUCCESS, hash: data })
      } else if (isError && error) {
        if (error instanceof UserRejectedRequestError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Transaction rejected by user"),
          })
        } else if (error instanceof InsufficientFundsError) {
          setState({
            status: TransactionStatus.ERROR,
            error: new Error("Insufficient funds for transaction"),
          })
        } else if (error instanceof ContractFunctionExecutionError) {
          // Try to extract revert reason
          const revertReason = error.message.match(/reverted with reason string '([^']+)'/)
          setState({
            status: TransactionStatus.ERROR,
            error: new Error(revertReason ? revertReason[1] : "Contract execution failed"),
          })
        } else {
          setState({
            status: TransactionStatus.ERROR,
            error: error instanceof Error ? error : new Error("Transaction failed"),
          })
        }
      }
    }, [isPending, isSuccess, isError, data, error])

    return { claim, ...state }
  }

  // Format pool data for display
  function formatPoolData(pool: PoolInfo) {
    return {
      ...pool,
      totalValueLockedFormatted: formatUnits(pool.totalValueLocked, 18),
      apyFormatted: Number(pool.apy) / 100,
      minInvestmentFormatted: formatUnits(pool.minInvestment, 18),
      lockPeriodDays: Number(pool.lockPeriod) / 86400, // Convert seconds to days
    }
  }

  return {
    useAvailablePools,
    usePoolDetails,
    useInvestorInfo,
    useInvestInPool,
    useWithdrawFromPool,
    useClaimRewards,
    formatPoolData,
  }
}
