"use client"

import type React from "react"
import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary component to catch and display errors in the component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    // Call onReset if provided
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-medium">Something went wrong</h3>
          </div>

          <p className="text-sm text-gray-300 mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>

          <button
            onClick={this.resetErrorBoundary}
            className="flex items-center gap-1 px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md text-sm transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component to wrap components with an ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">,
): React.FC<P> {
  const displayName = Component.displayName || Component.name || "Component"

  const ComponentWithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`

  return ComponentWithErrorBoundary
}
