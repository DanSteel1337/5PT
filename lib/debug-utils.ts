/**
 * Utility functions for debugging and logging
 */

// Debug levels as an enum
export enum DebugLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  TRACE = 5,
}

// Get the current debug level from environment variable or localStorage
export function getDebugLevel(): DebugLevel {
  if (typeof window !== "undefined") {
    // Try to get from localStorage first (allows runtime changes)
    const localStorageLevel = localStorage.getItem("debugLevel")
    if (localStorageLevel && !isNaN(Number.parseInt(localStorageLevel))) {
      return Number.parseInt(localStorageLevel) as DebugLevel
    }
  }

  // Fall back to environment variable
  const envLevel = process.env.NEXT_PUBLIC_DEBUG_LEVEL
  if (envLevel && !isNaN(Number.parseInt(envLevel))) {
    return Number.parseInt(envLevel) as DebugLevel
  }

  return DebugLevel.ERROR // Default to ERROR if not set
}

// Set the debug level (saves to localStorage for persistence)
export function setDebugLevel(level: DebugLevel): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("debugLevel", level.toString())
  }
}

// Debug log function with component name and level
export function debugLog(component: string, message: string, level: DebugLevel = DebugLevel.DEBUG, data?: any): void {
  const currentLevel = getDebugLevel()

  // Only log if the current level is high enough
  if (currentLevel >= level) {
    const timestamp = new Date().toISOString()
    const prefix = `[${DebugLevel[level]}][${component}]`

    switch (level) {
      case DebugLevel.ERROR:
        console.error(`${prefix} ${message}`, data || "")
        break
      case DebugLevel.WARN:
        console.warn(`${prefix} ${message}`, data || "")
        break
      case DebugLevel.INFO:
        console.info(`${prefix} ${message}`, data || "")
        break
      case DebugLevel.DEBUG:
      case DebugLevel.TRACE:
      default:
        console.log(`${prefix} ${message}`, data || "")
        break
    }
  }
}

// Helper to log component lifecycle events
export function logComponentLifecycle(
  componentName: string,
  event: "mount" | "unmount" | "render" | "update" | "error",
  props?: any,
): void {
  debugLog(componentName, `Component ${event}`, DebugLevel.DEBUG, props)
}

// Helper to log errors with more context
export function logError(component: string, error: Error, context?: any): void {
  debugLog(component, `Error: ${error.message}`, DebugLevel.ERROR, {
    error,
    stack: error.stack,
    context,
  })
}

// Debug component function
export function debugComponent(name: string, component: any): any {
  logger.debug(name, "Component details:", {
    component,
    type: typeof component,
    isValid: typeof component === "function" || (component && typeof component === "object"),
    constructor: component?.constructor?.name,
    prototype: component?.prototype,
    keys: component ? Object.keys(component) : [],
  })

  if (!component) {
    logger.error(name, `Component is ${component} - this will cause "is not a function" errors`)
  } else if (typeof component !== "function" && (!component || typeof component !== "object")) {
    logger.error(name, `Component is not a valid React component (type: ${typeof component})`)
  }

  return component
}

// Logger object
export const logger = {
  trace: (component: string, message: string, data?: any) => debugLog(component, message, DebugLevel.TRACE, data),
  debug: (component: string, message: string, data?: any) => debugLog(component, message, DebugLevel.DEBUG, data),
  info: (component: string, message: string, data?: any) => debugLog(component, message, DebugLevel.INFO, data),
  warn: (component: string, message: string, data?: any) => debugLog(component, message, DebugLevel.WARN, data),
  error: (component: string, message: string, data?: any) => debugLog(component, message, DebugLevel.ERROR, data),
}

// Initialize debug level on load
if (typeof window !== "undefined") {
  // This will run only on the client side
  const debugLevelFromEnv = process.env.NEXT_PUBLIC_DEBUG_LEVEL
  if (debugLevelFromEnv && !localStorage.getItem("debugLevel")) {
    localStorage.setItem("debugLevel", debugLevelFromEnv)
  }
}
