"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <details className="whitespace-pre-wrap">
              <summary>Show error details</summary>
              <p className="mt-2 text-sm font-mono">{this.state.error?.toString()}</p>
            </details>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
