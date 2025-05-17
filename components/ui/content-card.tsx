/**
 * @file content-card.tsx
 * @description Content card component with animation effects
 *
 * This file implements a content card component with animation effects
 * using Framer Motion. It provides a styled container for content with
 * hover effects and animations.
 *
 * @dependencies
 * - react: For component structure
 * - framer-motion: For animation effects
 *
 * @related
 * - components/landing/features.tsx: Uses this component
 * - components/landing/pool-qualification.tsx: Uses this component
 * - components/landing/tokenomics.tsx: Uses this component
 */

"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

/**
 * ContentCard Component Props
 */
interface ContentCardProps {
  /** The content of the card */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * ContentCard Component
 *
 * A styled card component with animation effects for displaying content.
 * Features a glass-like appearance with backdrop blur, border, and hover effects.
 * Animates on initial view using Framer Motion.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ContentCard>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </ContentCard>
 *
 * // With custom class
 * <ContentCard className="max-w-md mx-auto">
 *   <h3>Centered Card</h3>
 *   <p>This card has custom width and centering</p>
 * </ContentCard>
 *
 * // In a grid layout
 * <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 *   <ContentCard>Card 1</ContentCard>
 *   <ContentCard>Card 2</ContentCard>
 *   <ContentCard>Card 3</ContentCard>
 * </div>
 * ```
 */
export function ContentCard({ children, className = "" }: ContentCardProps) {
  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      whileHover={{
        borderColor: "rgba(139, 92, 246, 0.3)",
      }}
    >
      {children}
    </motion.div>
  )
}

export default ContentCard
