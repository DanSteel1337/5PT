// hooks/useFivePillarsToken.ts
"use client"

import { useReadContract, useReadContracts, useWriteContract, useAccount, useChainId } from "wagmi"
import { getContractAddress } from "@/contracts/addresses"
import { FIVE_PILLARS_TOKEN_ABI } from "@/contracts/abis/FivePillarsToken"
import { useMemo, useState } from "react"
import { type TokenInfo, TransactionStatus, type TransactionState } from "@/types/contracts"
import { formatUnits, parseUnits } from "viem"
import { 
  ContractFunctionExecutionError,
  UserRejectedRequestError,
  InsufficientFundsError 
} from 'viem'

// Custom hook for Five Pillars token contract interactions
export function useFivePillarsToken() {
  const { address } = useAccount()
  const chainId = useChainId()
  const tokenAddress = getContractAddress("fivePillarsToken", chainId)

  // Get token balance
  function useTokenBalance() {
    return useReadContract({
      address: tokenAddress,
      abi: FIVE_PILLARS_TOKEN_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  // Get token info (name, symbol, decimals) using batch read
  function useTokenInfo() {
    const { data, isLoading, isError } = useReadContracts({
      contracts: [
        {
          address: tokenAddress,
          abi: FIVE_PILLARS_TOKEN_ABI,
          functionName: "name",
        },
        {
          address: tokenAddress,
          abi: FIVE_PILLARS_TOKEN_ABI,
          functionName: "symbol",
        },
        {
          address: tokenAddress,
          abi: FIVE_PILLARS_TOKEN_ABI,
          functionName: "decimals",
        }
      ],
    })

    const tokenInfo: TokenInfo | undefined = useMemo(() => {
      if (data && data[0]?.result && data[1]?.result && data[2]?.result !== undefined) {
        return {
          name: data[0].result as string,
          symbol: data[1].result as string,
          decimals: Number(data[2].result),
        }
      }
      return undefined
    }, [data])

    return { 
      data: tokenInfo, 
      isLoading,
      isError
    }
  }

  // Check allowance
  function useTokenAllowance(spender: `0x${string}`) {
    return useReadContract({
      address: tokenAddress,
      abi: FIVE_PILLARS_TOKEN_ABI,
      functionName: "allowance",
      args: address && spender ? [address, spender] : undefined,
      query: {
        enabled: !!address && !!spender,
      },
    })
  }

  // Approve token spending with enhanced error handling
  function useApproveToken() {
    const { writeContract, data, error, isPending, isSuccess, isError } = useWriteContract()
    const [state, setState] = useState<TransactionState>({
      status: TransactionStatus.IDLE,
    })

    const approve = async (spender: `0x${string}`, amount: string) => {
      try {
        setState({ status: TransactionStatus.PENDING })

        const amountInWei = parseUnits(amount, 18)

        writeContract({
          address: tokenAddress,
          abi: FIVE_PILLARS_TOKEN_ABI,
          functionName: "approve",
          args: [spender, amountInWei],
        })
      } catch (error) {
        console.error("Approval error:", error)
        
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

    return { approve, ...state }
  }

  // Format token balance for display
  function formatTokenBalance(balance: bigint | undefined, decimals = 18) {
    if (balance === undefined) return "0"
    return formatUnits(balance, decimals)
  }

  return {
    useTokenBalance,
    useTokenInfo,
    useTokenAllowance,
    useApproveToken,
    formatTokenBalance,
  }
}
