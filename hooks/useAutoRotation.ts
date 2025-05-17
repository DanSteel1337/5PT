"use client"

import { useState, useEffect, useCallback } from "react"

interface UseAutoRotationProps {
  itemCount: number
  initialIndex?: number
  interval?: number
  pauseOnManualSelection?: boolean
  manualSelectionTimeout?: number
}

/**
 * Custom hook for auto-rotating through items
 *
 * @returns Functions that should only be called from event handlers or useEffect hooks
 */
export function useAutoRotation({
  itemCount,
  initialIndex = 0,
  interval = 5000,
  pauseOnManualSelection = true,
  manualSelectionTimeout = 15000,
}: UseAutoRotationProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isManualSelection, setIsManualSelection] = useState(false)

  // Reset manual selection flag after timeout
  useEffect(() => {
    if (isManualSelection && pauseOnManualSelection) {
      const timeout = setTimeout(() => {
        setIsManualSelection(false)
      }, manualSelectionTimeout)

      return () => clearTimeout(timeout)
    }
  }, [activeIndex, isManualSelection, manualSelectionTimeout, pauseOnManualSelection])

  // Auto-rotate through items
  useEffect(() => {
    if (pauseOnManualSelection && isManualSelection) return

    const rotationInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemCount)
    }, interval)

    return () => clearInterval(rotationInterval)
  }, [itemCount, interval, isManualSelection, pauseOnManualSelection])

  // Handle manual selection - wrapped in useCallback to prevent unnecessary re-renders
  const selectItem = useCallback((index: number) => {
    setActiveIndex(index)
    setIsManualSelection(true)
  }, [])

  return {
    activeIndex,
    selectItem, // Only call from event handlers or useEffect
    isManualSelection,
  }
}
