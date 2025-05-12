import type React from "react"
// lib/debug-utils.ts

// Define debug levels as an enum for better type safety
export enum DebugLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  TRACE = 5,
}

// Get the current debug level from environment or localStorage
export function getDebugLevel(): DebugLevel {
  if (typeof window !== "undefined") {
    // Client-side
    const storedLevel = localStorage.getItem("debugLevel")
    if (storedLevel !== null) {
      const level = Number.parseInt(storedLevel, 10)
      if (!isNaN(level) && level >= 0 && level <= 5) {
        return level as DebugLevel
      }
    }
  }

  // Server-side or fallback
  const envLevel = process.env.NEXT_PUBLIC_DEBUG_LEVEL
  if (envLevel) {
    const level = Number.parseInt(envLevel, 10)
    if (!isNaN(level) && level >= 0 && level <= 5) {
      return level as DebugLevel
    }
  }

  // Default to ERROR in production, INFO in development
  return process.env.NODE_ENV === "production" ? DebugLevel.ERROR : DebugLevel.INFO
}

// Set the debug level (client-side only)
export function setDebugLevel(level: DebugLevel): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("debugLevel", level.toString())
  }
}

// Helper to get debug level name
export function getDebugLevelName(level: DebugLevel): string {
  return DebugLevel[level] || "UNKNOWN"
}

// Structured logging helper
export const logger = {
  error: (component: string, message: string, ...args: any[]) => {
    if (getDebugLevel() >= DebugLevel.ERROR) {
      console.error(`[${component}][ERROR] ${message}`, ...args)
    }
  },
  warn: (component: string, message: string, ...args: any[]) => {
    if (getDebugLevel() >= DebugLevel.WARN) {
      console.warn(`[${component}][WARN] ${message}`, ...args)
    }
  },
  info: (component: string, message: string, ...args: any[]) => {
    if (getDebugLevel() >= DebugLevel.INFO) {
      console.info(`[${component}][INFO] ${message}`, ...args)
    }
  },
  debug: (component: string, message: string, ...args: any[]) => {
    if (getDebugLevel() >= DebugLevel.DEBUG) {
      console.debug(`[${component}][DEBUG] ${message}`, ...args)
    }
  },
  trace: (component: string, message: string, ...args: any[]) => {
    if (getDebugLevel() >= DebugLevel.TRACE) {
      console.trace(`[${component}][TRACE] ${message}`, ...args)
    }
  },
}

// Export logger as log for backward compatibility
export const log = logger

// Helper function for simple debug logging
export const debugLog = (
  component: string,
  message: string,
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" = "DEBUG",
  ...args: any[]
) => {
  const debugLevel = getDebugLevel()
  const levelValue = DebugLevel[level]

  if (debugLevel >= levelValue) {
    console.log(`[${component}] ${level}: ${message}`, ...args)
  }
}

// Function to safely stringify objects for logging
export function safeStringify(obj: any, indent = 2): string {
  try {
    return JSON.stringify(
      obj,
      (key, value) => {
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack,
          }
        }
        return value
      },
      indent,
    )
  } catch (error) {
    return `[Unstringifiable Object: ${error instanceof Error ? error.message : String(error)}]`
  }
}

// Function to add debug information to a component
export function debugComponent<T extends React.ComponentType<any>>(
  Component: T,
  componentName: string = Component.name || "UnnamedComponent",
): T {
  if (process.env.NODE_ENV === "development") {
    Component.displayName = componentName
  }
  return Component
}
