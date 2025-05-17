/**
 * @file card.tsx
 * @description Card component for displaying content in a contained box
 *
 * This file implements a card component with header, title, description, content,
 * and footer sections. It provides a consistent container for displaying related
 * content with proper spacing and styling.
 *
 * @dependencies
 * - react: For component structure
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/ui/CyberCard.tsx: Alternative card style
 * - components/ui/content-card.tsx: Alternative card with animations
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card Component
 *
 * The main container for the card component.
 * Provides the outer styling and structure.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

/**
 * CardHeader Component
 *
 * The header section of the card.
 * Contains the title and description.
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

/**
 * CardTitle Component
 *
 * The title of the card.
 * Typically used within CardHeader.
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

/**
 * CardDescription Component
 *
 * The description of the card.
 * Typically used within CardHeader.
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

/**
 * CardContent Component
 *
 * The main content area of the card.
 * Contains the primary content.
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

/**
 * CardFooter Component
 *
 * The footer section of the card.
 * Typically contains actions or additional information.
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
