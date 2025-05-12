/**
 * Helper function to safely import modules in the v0 environment
 * with proper error handling and fallbacks
 */

// Generic type for dynamic imports
type DynamicImport<T> = Promise<T>

/**
 * Safely imports a module with fallback
 * @param importFn The import function to execute
 * @param fallback Optional fallback value if import fails
 * @returns The imported module or fallback
 */
export async function safeImport<T>(importFn: () => DynamicImport<T>, fallback?: T): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    console.warn(`Dynamic import failed:`, error)
    if (fallback !== undefined) {
      return fallback
    }
    throw error
  }
}

/**
 * Safely imports html2canvas with proper error handling
 */
export async function importHtml2Canvas() {
  return safeImport(async () => {
    const module = await import("html2canvas")
    return module.default || module
  }, null)
}

/**
 * Safely imports recharts components with proper error handling
 */
export async function importRecharts() {
  return safeImport(async () => {
    return {
      LineChart: (await import("recharts")).LineChart,
      Line: (await import("recharts")).Line,
      XAxis: (await import("recharts")).XAxis,
      YAxis: (await import("recharts")).YAxis,
      CartesianGrid: (await import("recharts")).CartesianGrid,
      Tooltip: (await import("recharts")).Tooltip,
      Legend: (await import("recharts")).Legend,
      ResponsiveContainer: (await import("recharts")).ResponsiveContainer,
    }
  })
}
