"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Bug, RefreshCw, Download } from "lucide-react"
import { DebugLevel, getDebugLevel, setDebugLevel } from "@/lib/debug-utils"

export function DebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [debugLevel, setDebugLevelState] = useState<DebugLevel>(DebugLevel.ERROR)
  const [environment, setEnvironment] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Error[]>([])

  // Use refs to store original console methods and prevent re-entrancy
  const originalConsole = useRef<{
    error: typeof console.error
    warn: typeof console.warn
    log: typeof console.log
  } | null>(null)
  const isLogging = useRef(false)

  // Initialize debug panel
  useEffect(() => {
    try {
      // Only show in development or if explicitly enabled via localStorage
      const showDebugPanel = process.env.NODE_ENV === "development" || localStorage.getItem("showDebugPanel") === "true"
      setIsVisible(showDebugPanel)

      // Get current debug level
      setDebugLevelState(getDebugLevel())

      // Collect environment variables
      const env: Record<string, string> = {}
      Object.keys(process.env).forEach((key) => {
        if (key.startsWith("NEXT_PUBLIC_")) {
          env[key] = process.env[key] as string
        }
      })
      setEnvironment(env)

      // Store original console methods
      if (!originalConsole.current) {
        originalConsole.current = {
          error: console.error,
          warn: console.warn,
          log: console.log,
        }
      }

      // Safely override console methods
      console.error = function safeConsoleError(...args) {
        // Prevent re-entrancy
        if (isLogging.current) {
          return originalConsole.current?.error.apply(console, args)
        }

        try {
          isLogging.current = true
          // Add to our state
          const errorMessage = args
            .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
            .join(" ")

          setErrors((prev) => [...prev, new Error(errorMessage)])
          setLogs((prev) => [...prev, { type: "error", time: new Date(), args }])

          // Call original
          originalConsole.current?.error.apply(console, args)
        } finally {
          isLogging.current = false
        }
      }

      console.warn = function safeConsoleWarn(...args) {
        // Prevent re-entrancy
        if (isLogging.current) {
          return originalConsole.current?.warn.apply(console, args)
        }

        try {
          isLogging.current = true
          setLogs((prev) => [...prev, { type: "warn", time: new Date(), args }])
          originalConsole.current?.warn.apply(console, args)
        } finally {
          isLogging.current = false
        }
      }

      console.log = function safeConsoleLog(...args) {
        // Prevent re-entrancy
        if (isLogging.current) {
          return originalConsole.current?.log.apply(console, args)
        }

        try {
          isLogging.current = true
          setLogs((prev) => [...prev, { type: "log", time: new Date(), args }])
          originalConsole.current?.log.apply(console, args)
        } finally {
          isLogging.current = false
        }
      }

      // Log that debug panel is initialized using the original console
      originalConsole.current?.info?.("DebugPanel initialized", { level: debugLevel })
    } catch (error) {
      // If anything goes wrong, restore original console methods
      if (originalConsole.current) {
        console.error = originalConsole.current.error
        console.warn = originalConsole.current.warn
        console.log = originalConsole.current.log
      }

      // Log the error using the original console.error
      if (originalConsole.current?.error) {
        originalConsole.current.error("Error initializing DebugPanel:", error)
      }
    }

    // Restore original console methods on cleanup
    return () => {
      if (originalConsole.current) {
        console.error = originalConsole.current.error
        console.warn = originalConsole.current.warn
        console.log = originalConsole.current.log
        originalConsole.current = null
      }
    }
  }, [])

  // Update debug level when changed
  const handleDebugLevelChange = (level: DebugLevel) => {
    setDebugLevel(level)
    setDebugLevelState(level)

    // Use the original console to avoid recursion
    if (originalConsole.current?.info) {
      originalConsole.current.info(`Debug level changed to ${DebugLevel[level]}`)
    }
  }

  // Toggle debug panel visibility
  const toggleVisibility = () => {
    const newValue = !isVisible
    setIsVisible(newValue)
    localStorage.setItem("showDebugPanel", newValue.toString())
  }

  // Download debug info
  const downloadDebugInfo = () => {
    try {
      const debugInfo = {
        time: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        environment,
        debugLevel: DebugLevel[debugLevel],
        errors: errors.map((e) => ({ message: e.message, stack: e.stack })),
        logs: logs.slice(-100), // Last 100 logs
      }

      const blob = new Blob([JSON.stringify(debugInfo, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `debug-info-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      // Use original console to avoid recursion
      if (originalConsole.current?.error) {
        originalConsole.current.error("Error downloading debug info:", error)
      }
    }
  }

  if (!isVisible) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-100"
        onClick={toggleVisibility}
      >
        <Bug className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg z-50 bg-background/95 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center">
            <Bug className="h-4 w-4 mr-2" />
            Debug Panel
            <Badge variant="outline" className="ml-2">
              {errors.length} errors
            </Badge>
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleVisibility}>
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pb-2 pt-0">
          <Tabs defaultValue="errors">
            <TabsList className="w-full">
              <TabsTrigger value="errors">Errors ({errors.length})</TabsTrigger>
              <TabsTrigger value="env">Environment</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="errors" className="max-h-80 overflow-auto">
              {errors.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No errors detected</p>
              ) : (
                <div className="space-y-2">
                  {errors.slice(-5).map((error, index) => (
                    <div key={index} className="text-xs bg-red-950/20 p-2 rounded border border-red-500/20">
                      <p className="font-semibold text-red-400">{error.message}</p>
                      <pre className="mt-1 text-xs text-red-300/70 whitespace-pre-wrap break-all">
                        {error.stack?.split("\n").slice(0, 3).join("\n")}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="env" className="max-h-80 overflow-auto">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-xs font-semibold">Variable</div>
                  <div className="text-xs font-semibold">Value</div>
                </div>
                {Object.entries(environment).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-1 text-xs border-t border-border pt-1">
                    <div className="font-mono">{key}</div>
                    <div className="font-mono truncate">{value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Debug Level</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { level: DebugLevel.ERROR, label: "Error" },
                      { level: DebugLevel.WARN, label: "Warn" },
                      { level: DebugLevel.INFO, label: "Info" },
                      { level: DebugLevel.DEBUG, label: "Debug" },
                      { level: DebugLevel.TRACE, label: "Trace" },
                      { level: DebugLevel.NONE, label: "None" },
                    ].map(({ level, label }) => (
                      <Button
                        key={level}
                        size="sm"
                        variant={debugLevel === level ? "default" : "outline"}
                        onClick={() => handleDebugLevelChange(level)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}

      <CardFooter className="pt-2 pb-2 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs h-7"
          onClick={() => {
            // Use the original console.clear to avoid issues
            if (originalConsole.current?.clear) {
              originalConsole.current.clear()
            }
            setErrors([])
            setLogs([])
          }}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Clear Logs
        </Button>
        <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={downloadDebugInfo}>
          <Download className="h-3 w-3 mr-1" />
          Download Debug Info
        </Button>
      </CardFooter>
    </Card>
  )
}
