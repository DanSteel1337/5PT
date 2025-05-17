/**
 * @file section-container.tsx
 * @description Section container component for organizing page content
 *
 * This file implements a section container component with animation effects
 * using Framer Motion. It provides a consistent layout for page sections
 * with optional title and subtitle.
 *
 * @dependencies
 * - react: For component structure and forwardRef
 * - framer-motion: For animation effects
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/landing/features.tsx: Uses this component
 * - components/landing/tokenomics.tsx: Uses this component
 * - components/landing/pool-qualification.tsx: Uses this component
 */

"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Container from "@/components/ui/container" // Declare the Container variable

/**
 * SectionContainer Component Props
 */
interface SectionContainerProps {
  /** Optional ID for the section (for navigation/anchors) */
  id?: string
  /** Optional title for the section */
  title?: string
  /** Optional subtitle for the section */
  subtitle?: string
  /** The content of the section */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
  centered?: boolean
  maxWidth?: string
}

/**
 * SectionContainer Component
 *
 * A container component for page sections with consistent styling and
 * optional animated title and subtitle. Provides proper spacing and
 * container width.
 *
 * @example
 * \`\`\`tsx
 * // Basic usage
 * <SectionContainer>
 *   <p>Section content goes here</p>
 * </SectionContainer>
 *
 * // With title and subtitle
 * <SectionContainer
 *   id="features"
 *   title="FEATURES"
 *   subtitle="Explore our amazing features"
 * >
 *   <FeatureList />
 * </SectionContainer>
 *
 * // With custom class
 * <SectionContainer className="bg-gray-100">
 *   <p>Custom background section</p>
 * </SectionContainer>
 * \`\`\`
 */
export function SectionContainer({
  id,
  title,
  subtitle,
  children,
  centered = true,
  maxWidth = "max-w-7xl",
  className = "",
  ...props
}: SectionContainerProps): JSX.Element {
  return (
    <section id={id} className={cn("py-20 relative", className)} {...props}>
      <Container className={cn("mx-auto px-4 md:px-6 lg:px-8", maxWidth)}>
        {(title || subtitle) && (
          <div className={cn("mb-12", centered && "text-center")}>
            {title && <h2 className="text-4xl md:text-5xl font-bold mb-4 enhanced-heading">{title}</h2>}
            {subtitle && <p className={cn("text-xl text-gray-300", centered && "max-w-3xl mx-auto")}>{subtitle}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

SectionContainer.displayName = "SectionContainer"
