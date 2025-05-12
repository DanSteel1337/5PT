"use client"

import type React from "react"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the ModernSidebar with SSR disabled
const DynamicModernSidebar = dynamic(() => import("./modern-sidebar").then((mod) => mod.ModernSidebar), {
  ssr: false,
  loading: () => <SidebarSkeleton />,
})

// Skeleton loader for the sidebar
function SidebarSkeleton() {
  return (
    <div className="pb-12 circuit-bg">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex items-center justify-center mb-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-24 ml-2" />
          </div>
          <div className="space-y-2">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border/50">
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
            </div>
          </div>
          <div className="mt-6 pt-6">
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SafeModernSidebar(props: React.ComponentProps<typeof DynamicModernSidebar>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <SidebarSkeleton />
  }

  return <DynamicModernSidebar {...props} />
}
