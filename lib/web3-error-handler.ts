import { BaseError } from "viem"

// Error types
export enum Web3ErrorType {
  WALLET_CONNECTION = "WALLET_CONNECTION",
  CONTRACT_READ = "CONTRACT_READ",
  CONTRACT_WRITE = "CONTRACT_WRITE",
  TRANSACTION = "TRANSACTION",
  NETWORK = "NETWORK",
  USER_REJECTED = "USER_REJECTED",
  UNKNOWN = "UNKNOWN",
}

// Error severity
export enum ErrorSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

// Web3 error interface
export interface Web3Error {
  type: Web3ErrorType
  message: string
  severity: ErrorSeverity
  originalError?: unknown
  code?: string | number
  action?: string
}

/**
 * Handles Web3 errors and returns a standardized error object
 */
export function handleWeb3Error(error: unknown): Web3Error {
  // Handle viem BaseError
  if (error instanceof BaseError) {
    // User rejected transaction
    if (error.name === "UserRejectedRequestError") {
      return {
        type: Web3ErrorType.USER_REJECTED,
        message: "Transaction was rejected by the user",
        severity: ErrorSeverity.INFO,
        originalError: error,
        action: "Please try again and confirm the transaction in your wallet",
      }
    }

    // Contract errors
    if (error.name === "ContractFunctionExecutionError") {
      return {
        type: Web3ErrorType.CONTRACT_WRITE,
        message: "Contract execution failed",
        severity: ErrorSeverity.ERROR,
        originalError: error,
        code: error.cause?.name || "EXECUTION_ERROR",
        action: "Please check your transaction parameters and try again",
      }
    }

    // Network errors
    if (error.name === "NetworkError") {
      return {
        type: Web3ErrorType.NETWORK,
        message: "Network connection error",
        severity: ErrorSeverity.WARNING,
        originalError: error,
        action: "Please check your internet connection and try again",
      }
    }

    // Chain disconnected
    if (error.name === "ChainDisconnectedError") {
      return {
        type: Web3ErrorType.NETWORK,
        message: "Disconnected from the blockchain network",
        severity: ErrorSeverity.WARNING,
        originalError: error,
        action: "Please reconnect to the network and try again",
      }
    }

    // Insufficient funds
    if (error.name === "InsufficientFundsError") {
      return {
        type: Web3ErrorType.TRANSACTION,
        message: "Insufficient funds for transaction",
        severity: ErrorSeverity.ERROR,
        originalError: error,
        action: "Please add funds to your wallet and try again",
      }
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    if (error.includes("user rejected") || error.includes("User denied")) {
      return {
        type: Web3ErrorType.USER_REJECTED,
        message: "Transaction was rejected by the user",
        severity: ErrorSeverity.INFO,
        originalError: error,
        action: "Please try again and confirm the transaction in your wallet",
      }
    }

    if (error.includes("insufficient funds")) {
      return {
        type: Web3ErrorType.TRANSACTION,
        message: "Insufficient funds for transaction",
        severity: ErrorSeverity.ERROR,
        originalError: error,
        action: "Please add funds to your wallet and try again",
      }
    }
  }

  // Handle unknown errors
  return {
    type: Web3ErrorType.UNKNOWN,
    message: "An unknown error occurred",
    severity: ErrorSeverity.ERROR,
    originalError: error,
    action: "Please try again or contact support if the issue persists",
  }
}

/**
 * Gets a user-friendly error message from a Web3Error
 */
export function getErrorMessage(error: Web3Error): string {
  return `${error.message}. ${error.action || ""}`
}

/**
 * Logs a Web3Error to the console
 */
export function logWeb3Error(error: Web3Error): void {
  console.error(`[${error.type}] ${error.message}`, error.originalError)
}
