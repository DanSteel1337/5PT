/**
 * @file container.tsx
 * @description Reusable container component for consistent layout
 *
 * This file implements a container component that provides a consistent
 * maximum width and horizontal padding for content across the application.
 * It's used to create a consistent visual rhythm and prevent content from
 * stretching too wide on large screens.
 *
 * @related
 * - components/ui/section-container.tsx: Uses this component
 * - app/page.tsx: Uses section container which uses this component
 */

import type { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Container Component
 *
 * A simple container component that centers its children and applies a
 * maximum width and horizontal padding.
 *
 * @example
 * \`\`\`tsx
 * <Container>
 *   <h1>My Content</h1>
 *   <p>This content is centered and has a maximum width.</p>
 * </Container>
 *
 * // With custom class
 * <Container className="bg-gray-100">
 *   <h1>Custom Background</h1>
 * </Container>
 * \`\`\`
 */
export default function Container({ children, className = "" }: ContainerProps): JSX.Element {
  return <div className={`container ${className}`}>{children}</div>
}
