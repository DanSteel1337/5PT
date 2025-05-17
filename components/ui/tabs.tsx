/**
 * @file tabs.tsx
 * @description Tabs component for organizing content into tabbed interfaces
 *
 * This file implements a tabs component based on Radix UI's Tabs primitive.
 * It provides a way to organize content into tabbed interfaces with customizable
 * styling and accessibility features.
 *
 * @dependencies
 * - react: For component structure
 * - @radix-ui/react-tabs: For tabs functionality
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/landing/investment-calculator.tsx: Uses this component
 * - components/ui/card.tsx: Often used together with this component
 */

"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * Tabs Component
 *
 * The root component that contains the entire tabs interface.
 * Wraps TabsList and TabsContent components.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
const Tabs = TabsPrimitive.Root

/**
 * TabsList Component
 *
 * The container for the tab triggers/buttons.
 * Provides styling and accessibility features.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex h-10 items-center justify-center rounded-md bg-black/30 p-1 text-gray-400", className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * TabsTrigger Component
 *
 * The clickable tab button that activates its associated content.
 * Provides styling for active and inactive states.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-400 data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * TabsContent Component
 *
 * The content panel associated with a tab.
 * Only visible when its associated tab is active.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
