export interface BlockchainError {
  type: string
  title: string
  message: string
  suggestion?: string
  originalError?: any
}

export function parseBlockchainError(error: any): BlockchainError {
  console.log("Parsing blockchain error:", error)

  // Default error
  const defaultError: BlockchainError = {
    type: "unknown",
    title: "Transaction Failed",
    message: "An unexpected error occurred while processing your transaction.",
    suggestion: "Please try again or contact support if the issue persists.",
    originalError: error,
  }

  if (!error) return defaultError

  // Extract error message from various error formats
  let errorMessage = ""
  if (typeof error === "string") {
    errorMessage = error
  } else if (error.message) {
    errorMessage = error.message
  } else if (error.error && error.error.message) {
    errorMessage = error.error.message
  } else if (error.data && error.data.message) {
    errorMessage = error.data.message
  }

  errorMessage = errorMessage.toLowerCase()

  // Check for specific error types

  // User rejected transaction
  if (
    errorMessage.includes("user rejected") ||
    errorMessage.includes("user denied") ||
    errorMessage.includes("rejected by user")
  ) {
    return {
      type: "user_rejected",
      title: "Transaction Cancelled",
      message: "You cancelled the transaction.",
      suggestion: "Please try again when you're ready to proceed.",
      originalError: error,
    }
  }

  // Insufficient funds
  if (errorMessage.includes("insufficient funds") || errorMessage.includes("not enough balance")) {
    return {
      type: "insufficient_funds",
      title: "Insufficient Funds",
      message: "You don't have enough funds to complete this transaction.",
      suggestion: "Please add more funds to your wallet or try a smaller amount.",
      originalError: error,
    }
  }

  // Gas estimation failed
  if (errorMessage.includes("gas estimation failed") || errorMessage.includes("execution reverted")) {
    // Try to extract revert reason if available
    let revertReason = "The transaction would fail. This is often due to contract conditions not being met."

    // Extract custom revert reason if available
    const revertMatch = errorMessage.match(/execution reverted: (.*?)(?:"|$)/i)
    if (revertMatch && revertMatch[1]) {
      revertReason = revertMatch[1]
    }

    return {
      type: "execution_reverted",
      title: "Transaction Would Fail",
      message: revertReason,
      suggestion: "Check that you meet all requirements for this action.",
      originalError: error,
    }
  }

  // Network connection issues
  if (
    errorMessage.includes("network error") ||
    errorMessage.includes("disconnected") ||
    errorMessage.includes("connection") ||
    errorMessage.includes("timeout")
  ) {
    return {
      type: "network_error",
      title: "Network Error",
      message: "Unable to connect to the blockchain network.",
      suggestion: "Check your internet connection and try again.",
      originalError: error,
    }
  }

  // Nonce too low / Transaction underpriced
  if (
    errorMessage.includes("nonce too low") ||
    errorMessage.includes("underpriced") ||
    errorMessage.includes("replacement transaction underpriced")
  ) {
    return {
      type: "nonce_error",
      title: "Transaction Conflict",
      message: "There was a conflict with another pending transaction.",
      suggestion: "Please try again or check your wallet for pending transactions.",
      originalError: error,
    }
  }

  // Invalid address
  if (errorMessage.includes("invalid address")) {
    return {
      type: "invalid_address",
      title: "Invalid Address",
      message: "One of the addresses in this transaction is invalid.",
      suggestion: "Please check all addresses and try again.",
      originalError: error,
    }
  }

  // Contract address error
  if (
    errorMessage.includes("contract not deployed") ||
    errorMessage.includes("address not found") ||
    errorMessage.includes("call exception")
  ) {
    return {
      type: "contract_error",
      title: "Contract Error",
      message: "The contract address may be incorrect or not deployed on this network.",
      suggestion: "Please verify you're on the correct network and that the contract address is correct.",
      originalError: error,
    }
  }

  // Slippage tolerance exceeded
  if (errorMessage.includes("slippage") || errorMessage.includes("price impact too high")) {
    return {
      type: "slippage_error",
      title: "Price Changed",
      message: "The transaction would result in an unfavorable price change.",
      suggestion: "Try again or adjust your slippage tolerance.",
      originalError: error,
    }
  }

  // Return default error if no specific type was identified
  return {
    ...defaultError,
    message: errorMessage || defaultError.message,
  }
}
