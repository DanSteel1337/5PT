"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Bug, Code } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  componentStack: string
  errorTime: Date | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    componentStack: "",
    errorTime: null,
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorTime: new Date(),
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console with enhanced details
    console.error("=== ERROR BOUNDARY CAUGHT ERROR ===")
    console.error(`Component: ${this.props.componentName || "Unknown"}`)
    console.error(`Error: ${error.message}`)
    console.error(`Stack: ${error.stack}`)
    console.error(`Component Stack: ${errorInfo.componentStack}`)
    console.error("=== END ERROR BOUNDARY ERROR ===")

    // Extract component stack for display
    const componentStack = errorInfo.componentStack
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => line.trim())
      .join("\n")

    // Update state with error details
    this.setState({
      errorInfo,
      componentStack,
    })

    // You can also send this to an error reporting service
    // reportErrorToService(error, errorInfo, this.props.componentName)
  }

  private formatErrorMessage(error: Error): string {
    if (error.message.includes("is not a function")) {
      return `A component or function is being called incorrectly. This often happens with dynamic imports or when a component is not properly exported/imported.
      
Original error: ${error.message}`
    }

    return error.message
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-500/30 bg-red-900/10 max-w-3xl mx-auto my-8">
          <CardHeader>
            <CardTitle className="flex items-center text-red-300">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Application Error in {this.props.componentName || "Unknown Component"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error ? this.formatErrorMessage(this.state.error) : "An unexpected error occurred"}
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="error-details">
                <AccordionTrigger className="text-sm text-red-300">
                  <Code className="h-4 w-4 mr-2" />
                  Technical Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-black/50 p-3 rounded text-xs font-mono text-red-300 overflow-x-auto">
                    <p className="mb-2">
                      <strong>Error:</strong> {this.state.error?.toString()}
                    </p>
                    <p className="mb-2">
                      <strong>Time:</strong> {this.state.errorTime?.toISOString()}
                    </p>
                    {this.state.componentStack && (
                      <>
                        <p className="mb-1">
                          <strong>Component Stack:</strong>
                        </p>
                        <pre className="whitespace-pre-wrap break-all">{this.state.componentStack}</pre>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="border-red-500/30 text-red-300 hover:bg-red-900/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-red-500/30 text-red-300 hover:bg-red-900/20"
            >
              <Bug className="mr-2 h-4 w-4" />
              Reload page
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}
