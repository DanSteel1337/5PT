# RainbowKit Integration Guide for Next.js App Router in Vercel v0

This guide documents best practices, common issues, and solutions for integrating RainbowKit v2, wagmi v2, and TanStack Query v5 with Next.js App Router, specifically optimized for Vercel v0 environments.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Provider Setup](#provider-setup)
3. [Common Issues & Solutions](#common-issues--solutions)
4. [Module Resolution](#module-resolution)
5. [SSR Configuration](#ssr-configuration)
6. [Hydration Strategy](#hydration-strategy)
7. [Debugging Techniques](#debugging-techniques)
8. [Next.js Configuration](#nextjs-configuration)
9. [Vercel v0 Specific Considerations](#vercel-v0-specific-considerations)
10. [Reference Implementation](#reference-implementation)

## Architecture Overview

Our Web3 integration follows this architecture:

\`\`\`mermaid
graph TD
    A[app/layout.tsx] -->|Imports| B[Providers.tsx]
    B -->|Imports| C[Web3Provider.tsx]
    C -->|Creates| D[QueryClient]
    C -->|Configures| E[WagmiProvider]
    C -->|Configures| F[QueryClientProvider]
    C -->|Configures| G[RainbowKitProvider]
    H[Web3 Components] -->|Use| I[wagmi hooks]
    I -->|Depend on| F
\`\`\`

### Key Dependencies

\`\`\`json
{
  "@rainbow-me/rainbowkit": "2.2.4",
  "wagmi": "2.14.15",
  "viem": "2.23.9",
  "@tanstack/react-query": "5.76.0",
  "next": "15.3.2"
}
\`\`\`

## Provider Setup

### Critical Requirements

1. **Provider Nesting Order**
   - WagmiProvider > QueryClientProvider > RainbowKitProvider
   - This order is critical for context propagation

2. **Client Components**
   - All provider components must be client components (`'use client'`)
   - Web3 functionality must be in client components

3. **QueryClient Stability**
   - QueryClient must be created with useState to ensure stability
   - Must be a singleton instance across renders

### Reference Implementation

\`\`\`tsx
// components/providers/Web3Provider.tsx
"use client"

import { useState, useEffect, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi-config"
import { customRainbowKitTheme } from "@/lib/rainbowkit-theme"

export function Web3Provider({ children }: { children: ReactNode }) {
  // Create a stable QueryClient instance
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    })
  )

  // Handle hydration safely
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customRainbowKitTheme}>
          {mounted ? children : <div className="min-h-screen bg-black"></div>}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
\`\`\`

## Common Issues & Solutions

### 1. "No QueryClient set, use QueryClientProvider to set one"

This error occurs when a component tries to use a query hook but can't find the QueryClientProvider context.

**Root Causes:**
- Module resolution mismatch (ESM vs CJS)
- Multiple instances of TanStack Query
- Provider not mounted before hooks are called
- Incorrect provider nesting order

**Solutions:**
- Ensure consistent module resolution (see [Module Resolution](#module-resolution))
- Verify provider nesting order
- Add mounting checks to prevent premature hook calls
- Configure wagmi with `ssr: true`

### 2. Hydration Errors

**Root Causes:**
- Components accessing browser APIs during SSR
- Content mismatch between server and client renders

**Solutions:**
- Use mounting checks (`mounted` state + useEffect)
- Configure wagmi with `ssr: true`
- Add `suppressHydrationWarning` to html element
- Use `cookieStorage` instead of `localStorage` for persistence

### 3. RainbowKit Styles Not Loading

**Root Causes:**
- Direct imports of RainbowKit styles in client components
- CSS loading issues in Vercel v0

**Solutions:**
- Import styles ONLY in app/layout.tsx
- Use RainbowKitStylesProvider for Vercel v0
- Avoid direct imports in client components

## Module Resolution

### The ESM/CJS Problem

One of the most common causes of "No QueryClient set" errors is module resolution mismatch between ESM and CJS versions of TanStack Query. This creates two separate instances of React Query - one used by your QueryClientProvider and another used internally by wagmi/RainbowKit.

### Solutions

1. **Webpack Configuration**

\`\`\`js
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tanstack/react-query": require.resolve("@tanstack/react-query"),
    }
    return config
  },
}
\`\`\`

2. **ESM Configuration**

\`\`\`js
// next.config.js
module.exports = {
  experimental: {
    esmExternals: 'loose',
  },
}
\`\`\`

3. **Package Deduplication**

Ensure you don't have duplicate versions of @tanstack/react-query in your node_modules:

\`\`\`bash
npm dedupe
# or
yarn dedupe
\`\`\`

## SSR Configuration

### Wagmi SSR Mode

Configure wagmi with `ssr: true` to prevent localStorage errors during server rendering:

\`\`\`tsx
// lib/wagmi-config.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

export const config = getDefaultConfig({
  appName: "Your App",
  projectId: "your-project-id",
  chains: [...],
  ssr: true, // Enable SSR mode
})
\`\`\`

### Cookie Storage

For better SSR compatibility, use cookieStorage instead of localStorage:

\`\`\`tsx
import { cookieStorage, createStorage } from "wagmi"

const storage = createStorage({
  storage: cookieStorage,
})

export const config = getDefaultConfig({
  // ...other config
  storage,
  ssr: true,
})
\`\`\`

## Hydration Strategy

### Safe Mounting Pattern

\`\`\`tsx
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])

// Render providers immediately, but delay children
return (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {mounted ? children : <div className="min-h-screen bg-black"></div>}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
\`\`\`

### Suspense Considerations

Using Suspense around providers can affect hydration timing:

\`\`\`tsx
// app/layout.tsx
<Suspense fallback={<div className="min-h-screen bg-black"></div>}>
  <Providers>{children}</Providers>
</Suspense>
\`\`\`

This approach can sometimes create timing issues in Vercel v0. Consider removing the Suspense boundary if you encounter context problems.

## Debugging Techniques

### QueryClient Debug Component

\`\`\`tsx
"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export function QueryClientDebug() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    console.log("QueryClient available:", queryClient)
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Is Vercel v0:", typeof window !== "undefined" && 
      window.location.hostname.includes("vusercontent"))
  }, [queryClient])

  return (
    <div className="fixed bottom-4 right-4 z-50 p-3 bg-green-800 text-white text-xs rounded">
      ✅ QueryClient Available
    </div>
  )
}
\`\`\`

### Error Boundary for Debugging

\`\`\`tsx
"use client"

import { ErrorBoundary } from "react-error-boundary"

export function Web3ErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong with Web3 providers</div>}
      onError={(error) => console.error("Web3 Error:", error)}
    >
      {children}
    </ErrorBoundary>
  )
}
\`\`\`

## Next.js Configuration

### ESM vs CJS in Next.js

Next.js 15+ uses ESM by default. When creating configuration files:

- **next.config.js**: Uses CommonJS format, `require` is available
- **next.config.mjs**: Uses ESM format, use `import` instead of `require`

### ESM-Compatible Configuration

\`\`\`js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...other config
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use direct path for ESM compatibility
      "@tanstack/react-query": "./node_modules/@tanstack/react-query/build/lib/index.esm.js",
    }
    return config
  },
  experimental: {
    esmExternals: 'loose',
  }
}

export default nextConfig
\`\`\`

### CommonJS Configuration

\`\`\`js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...other config
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tanstack/react-query": require.resolve("@tanstack/react-query"),
    }
    return config
  },
  experimental: {
    esmExternals: 'loose',
  }
}

module.exports = nextConfig
\`\`\`

## Vercel v0 Specific Considerations

### Environment Detection

\`\`\`tsx
const isVercelV0 = typeof window !== "undefined" && 
  window.location.hostname.includes("vusercontent")
\`\`\`

### CSS Loading in Vercel v0

RainbowKit styles can be problematic in Vercel v0. Use a custom provider:

\`\`\`tsx
// components/providers/RainbowKitStylesProvider.tsx
"use client"

import { useEffect } from "react"

export function RainbowKitStylesProvider({ children }) {
  useEffect(() => {
    // Dynamically import styles in client
    import("@rainbow-me/rainbowkit/styles.css")
      .catch(err => console.error("Failed to load RainbowKit styles:", err))
  }, [])
  
  return <>{children}</>
}
\`\`\`

### Build Optimization

For Vercel v0, consider these build optimizations:

\`\`\`js
// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
\`\`\`

## Reference Implementation

### Complete Provider Structure

\`\`\`tsx
// app/layout.tsx
import Providers from "@/components/providers/Providers"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

// components/providers/Providers.tsx
"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "./Web3Provider"

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Web3Provider>{children}</Web3Provider>
    </ThemeProvider>
  )
}

// components/providers/Web3Provider.tsx
"use client"

import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi-config"
import { customRainbowKitTheme } from "@/lib/rainbowkit-theme"
import { RainbowKitStylesProvider } from "./RainbowKitStylesProvider"

export function Web3Provider({ children }) {
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    })
  )

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitStylesProvider>
          <RainbowKitProvider theme={customRainbowKitTheme}>
            {mounted ? children : <div className="min-h-screen bg-black"></div>}
          </RainbowKitProvider>
        </RainbowKitStylesProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// lib/wagmi-config.ts
"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"

export const config = getDefaultConfig({
  appName: "Your App",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true, // Enable SSR mode
})
\`\`\`

### Web3 Component Usage

\`\`\`tsx
"use client"

import { useAccount, useBalance } from "wagmi"

export function WalletBalance() {
  const { address } = useAccount()
  const { data, isLoading } = useBalance({ address })

  if (isLoading) return <div>Loading balance...</div>
  if (!address) return <div>Connect your wallet</div>

  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  )
}
\`\`\`

---

## Troubleshooting Checklist

If you encounter issues with RainbowKit, wagmi, or React Query in Vercel v0, follow this checklist:

1. ✅ Verify provider nesting order: WagmiProvider > QueryClientProvider > RainbowKitProvider
2. ✅ Ensure QueryClient is created with useState for stability
3. ✅ Check wagmi config has `ssr: true`
4. ✅ Verify next.config.js has proper module resolution settings
5. ✅ Check for duplicate @tanstack/react-query versions
6. ✅ Ensure all Web3 components have proper mounting checks
7. ✅ Verify RainbowKit styles are only imported in app/layout.tsx
8. ✅ Check for any console errors that occur before the QueryClient error
9. ✅ Test locally in production mode with `next build && next start`
10. ✅ Add the QueryClientDebug component to verify context availability

---

This guide is maintained by the 5PT Finance Team. Last updated: May 14, 2025.
