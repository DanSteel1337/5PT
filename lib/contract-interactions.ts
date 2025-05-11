import { safelyHandleBytes } from "./binary-utils"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESSES } from "./wagmi-config"
import { TOKEN_ABI, INVESTMENT_MANAGER_ABI } from "./contracts"

// Type for binary data that properly handles Uint8Array
type BinaryData = Uint8Array | string | number[] | readonly number[]

/**
 * Process transaction data safely
 * This fixes the "u[a] is undefined" error by properly handling byte arrays
 */
export function processTransactionData(data: BinaryData): Uint8Array {
  // Convert to Uint8Array safely using our utility
  return safelyHandleBytes(data)
}

/**
 * Decode log data from events
 */
export function decodeLogData(topics: string[], data: string) {
  // Convert hex strings to Uint8Array properly
  const topicsBytes = topics.map((topic) => safelyHandleBytes(topic))
  const dataBytes = safelyHandleBytes(data)

  // Now we can safely process the bytes
  return { topicsBytes, dataBytes }
}

/**
 * Custom hook for token approval with proper binary data handling
 */
export function useTokenApproval(spender: `0x${string}`, amount: bigint) {
  const { writeContract, isPending, data: hash } = useWriteContract()

  const approve = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "approve",
      args: [spender, amount],
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

/**
 * Custom hook for investment with proper binary data handling
 */
export function useInvestment(amount: bigint, referrer: `0x${string}` | undefined) {
  const { writeContract, isPending, data: hash } = useWriteContract()

  const invest = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "deposit",
      args: [amount, referrer || "0x0000000000000000000000000000000000000000"],
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    invest,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}
