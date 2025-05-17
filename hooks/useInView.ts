"use client"

import { useState, useEffect, useRef, type RefObject } from "react"

interface UseInViewOptions {
  threshold?: number
  triggerOnce?: boolean
}

/**
 * Custom hook for detecting when an element is in the viewport
 *
 * @param options Configuration options
 * @returns [ref, isInView] - Ref to attach to the element and boolean indicating if element is in view
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  triggerOnce = true,
}: UseInViewOptions = {}): [RefObject<T>, boolean] {
  const [isInView, setIsInView] = useState<boolean>(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.unobserve(currentRef)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold },
    )

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef)
    }
  }, [threshold, triggerOnce])

  return [ref, isInView]
}

export default useInView
