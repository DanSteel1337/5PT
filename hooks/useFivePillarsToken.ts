"use client"

import { useReadContract, useWriteContract, useAccount, useChainId } from "wagmi"
import { getContractAddress } from "@/contracts/addresses"
import { FIVE_PILLARS_TOKEN_ABI } from "@/contracts/abis/FivePillarsToken"
import { useMemo, useState } from "react"
import { type TokenInfo, TransactionStatus, type TransactionState } from "@/types/contracts"
import { formatUnits, parseUnits } from "viem"

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

  // Get token info (name, symbol, decimals)
  function useTokenInfo() {
    const { data: name } = useReadContract({
      address: tokenAddress,
      abi: FIVE_PILLARS_TOKEN_ABI,
      functionName: "name",
    })

    const { data: symbol } = useReadContract({
      address: tokenAddress,
      abi: FIVE_PILLARS_TOKEN_ABI,
      functionName: "symbol",
    })

    const { data: decimals } = useReadContract({
      address: tokenAddress,
      abi: FIVE_PILLARS_TOKEN_ABI,
      functionName: "decimals",
    })

    const tokenInfo: TokenInfo | undefined = useMemo(() => {
      if (name && symbol && decimals !== undefined) {
        return {
          name,
          symbol,
          decimals,
        }
      }
      return undefined
    }, [name, symbol, decimals])

    return { data: tokenInfo }
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

  // Approve token spending
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
        setState({
          status: TransactionStatus.ERROR,
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      }
    }

    // Update state based on transaction status
    useMemo(() => {
      if (isPending) {
        setState({ status: TransactionStatus.PENDING })
      } else if (isSuccess && data) {
        setState({ status: TransactionStatus.SUCCESS, hash: data })
      } else if (isError && error) {
        setState({
          status: TransactionStatus.ERROR,
          error: error instanceof Error ? error : new Error("Transaction failed"),
        })
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
