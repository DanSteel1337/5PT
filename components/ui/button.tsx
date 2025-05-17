/**
 * @file button.tsx
 * @description Button component with multiple variants and sizes
 *
 * This file implements a versatile button component with multiple variants,
 * sizes, and states. It provides consistent styling and accessibility features
 * for all button interactions throughout the application.
 *
 * @dependencies
 * - react: For component structure
 * - class-variance-authority: For variant management
 * - lucide-react: For the Loader icon
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/ui/CyberButton.tsx: Alternative button style
 * - components/web3/ConnectButton.tsx: Uses button components
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Button variants configuration
 *
 * Defines the different visual styles and sizes for the button component:
 * - Variants: default, destructive, outline, secondary, ghost, link
 * - Sizes: default, sm, lg, icon
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

/**
 * Button Component Props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether to render the component as a different element */
  asChild?: boolean
  /** Whether to show a loading spinner */
  isLoading?: boolean
}

/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading state, different variants, and can be rendered as a child component.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // Different variants
 * <Button variant="destructive">Delete</Button>
 * <Button variant="outline">Cancel</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="ghost">Ghost</Button>
 * <Button variant="link">Link</Button>
 *
 * // Different sizes
 * <Button size="sm">Small</Button>
 * <Button size="lg">Large</Button>
 * <Button size="icon"><PlusIcon /></Button>
 *
 * // Loading state
 * <Button isLoading>Processing...</Button>
 *
 * // As child
 * <Button asChild>
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Combine disabled state with isLoading
    const isDisabled = disabled || isLoading

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={isDisabled} {...props}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
