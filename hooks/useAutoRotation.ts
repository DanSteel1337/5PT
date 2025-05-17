"use client"

import { useState, useEffect, useCallback } from "react"

interface UseAutoRotationProps {
  itemCount: number
  initialIndex?: number
  interval?: number
  pauseOnManualSelection?: boolean
  manualSelectionTimeout?: number
}

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

  // Handle manual selection
  const selectItem = useCallback((index: number) => {
    setActiveIndex(index)
    setIsManualSelection(true)
  }, [])

  return {
    activeIndex,
    selectItem,
    isManualSelection,
  }
}
