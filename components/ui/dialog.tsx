/**
 * @file dialog.tsx
 * @description Dialog component for modal interfaces
 *
 * This file implements a dialog (modal) component based on Radix UI's Dialog primitive.
 * It provides an accessible modal interface with proper focus management, keyboard
 * navigation, and animation effects.
 *
 * @dependencies
 * - react: For component structure
 * - @radix-ui/react-dialog: For accessible dialog functionality
 * - lucide-react: For the X icon
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/ui/sheet.tsx: Similar sliding panel component
 * - components/ui/alert-dialog.tsx: Similar component for confirmations
 */

"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Dialog Component
 *
 * The root component that contains the entire dialog.
 * Controls the open state of the dialog.
 */
const Dialog = DialogPrimitive.Root

/**
 * DialogTrigger Component
 *
 * The button that triggers the dialog.
 * When clicked, it opens the dialog.
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * DialogPortal Component
 *
 * Renders the dialog content in a portal.
 * Ensures the dialog appears above other content.
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * DialogClose Component
 *
 * A button that closes the dialog.
 * Can be placed anywhere within the dialog content.
 */
const DialogClose = DialogPrimitive.Close

/**
 * DialogOverlay Component
 *
 * The backdrop overlay behind the dialog.
 * Dims the background and provides a clickable area to close the dialog.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * DialogContent Component
 *
 * The main content container for the dialog.
 * Contains the dialog's content and close button.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * DialogHeader Component
 *
 * The header section of the dialog.
 * Typically contains the title and description.
 */
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

/**
 * DialogFooter Component
 *
 * The footer section of the dialog.
 * Typically contains action buttons.
 */
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

/**
 * DialogTitle Component
 *
 * The title of the dialog.
 * Provides proper heading semantics and styling.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * DialogDescription Component
 *
 * The description of the dialog.
 * Provides additional context about the dialog's purpose.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

/**
 * Usage Example
 *
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="outline">Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>
 *         This is a description of the dialog's purpose.
 *       </DialogDescription>
 *     </DialogHeader>
 *     <div className="py-4">
 *       <p>Dialog content goes here</p>
 *     </div>
 *     <DialogFooter>
 *       <Button type="submit">Save changes</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
