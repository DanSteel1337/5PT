"use client"

import { useState, useCallback } from "react"

export interface ContractErrorState {
  error: Error | null
  errorMessage: string
  errorCode: string | null
  isError: boolean
}

/**
 * Custom hook for handling contract errors
 * Provides standardized error handling for contract interactions
 */
export function useContractError() {
  const [errorState, setErrorState] = useState<ContractErrorState>({
    error: null,
    errorMessage: "",
    errorCode: null,
    isError: false,
  })

  /**
   * Parse error from contract interaction
   * Extracts useful information from various error types
   */
  const parseError = useCallback((error: unknown): ContractErrorState => {
    // Default error state
    const defaultState: ContractErrorState = {
      error: error instanceof Error ? error : new Error(String(error)),
      errorMessage: "An unknown error occurred",
      errorCode: null,
      isError: true,
    }

    // Handle null/undefined
    if (!error) {
      return {
        error: null,
        errorMessage: "",
        errorCode: null,
        isError: false,
      }
    }

    try {
      // Handle standard Error objects
      if (error instanceof Error) {
        return {
          error,
          errorMessage: error.message || "An error occurred",
          errorCode: null,
          isError: true,
        }
      }

      // Handle error objects with data property (common in ethers/web3)
      if (typeof error === "object" && error !== null) {
        const errorObj = error as any

        // Extract error code if available
        const errorCode = errorObj.code || errorObj.errorCode || null

        // Extract error message from various possible locations
        let errorMessage = "An error occurred"
        if (errorObj.message) {
          errorMessage = errorObj.message
        } else if (errorObj.reason) {
          errorMessage = errorObj.reason
        } else if (errorObj.data?.message) {
          errorMessage = errorObj.data.message
        }

        // Clean up common error messages
        errorMessage = cleanErrorMessage(errorMessage)

        return {
          error: new Error(errorMessage),
          errorMessage,
          errorCode,
          isError: true,
        }
      }

      // Handle string errors
      if (typeof error === "string") {
        return {
          error: new Error(error),
          errorMessage: error,
          errorCode: null,
          isError: true,
        }
      }

      // Return default for unhandled error types
      return defaultState
    } catch (parseError) {
      console.error("Error parsing contract error:", parseError)
      return defaultState
    }
  }, [])

  /**
   * Handle contract error
   * Parses the error and updates state
   */
  const handleError = useCallback(
    (error: unknown, context?: string) => {
      if (context) {
        console.error(`Error in ${context}:`, error)
      } else {
        console.error("Contract error:", error)
      }

      const parsedError = parseError(error)
      setErrorState(parsedError)
      return parsedError
    },
    [parseError],
  )

  /**
   * Clear current error state
   */
  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      errorMessage: "",
      errorCode: null,
      isError: false,
    })
  }, [])

  return {
    ...errorState,
    handleError,
    clearError,
  }
}

/**
 * Clean up common error messages to be more user-friendly
 */
function cleanErrorMessage(message: string): string {
  // Remove common prefixes
  message = message.replace(/^Error: /, "")
  message = message.replace(/^execution reverted: /, "")

  // Handle specific error messages
  if (message.includes("insufficient funds")) {
    return "Insufficient funds for this transaction"
  }

  if (message.includes("user rejected")) {
    return "Transaction was rejected"
  }

  if (message.includes("gas required exceeds allowance")) {
    return "Transaction would exceed gas limit"
  }

  // Return cleaned message
  return message
}
