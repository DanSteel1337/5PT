"use client"

import { useState, useEffect } from "react"

export function SectionDebug() {
  const [sections, setSections] = useState<{ id: string; top: number; height: number }[]>([])
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const findSections = () => {
      const allSections = document.querySelectorAll("section[id]")
      const sectionData = Array.from(allSections).map((section) => {
        const rect = section.getBoundingClientRect()
        return {
          id: section.id,
          top: rect.top + window.scrollY,
          height: rect.height,
        }
      })
      setSections(sectionData)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", findSections)

    // Initial calculation
    findSections()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", findSections)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 text-xs font-mono max-w-xs">
      <h3 className="text-purple-400 font-bold mb-2">Section Debug</h3>
      <div className="text-gray-300 mb-2">Scroll: {scrollY.toFixed(0)}px</div>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {sections.map((section) => {
          const isVisible =
            scrollY >= section.top - window.innerHeight / 2 &&
            scrollY <= section.top + section.height - window.innerHeight / 2
          return (
            <div
              key={section.id}
              className={`flex justify-between p-1 rounded ${isVisible ? "bg-purple-900/30" : "bg-black/50"}`}
            >
              <span className={isVisible ? "text-purple-300" : "text-gray-400"}>{section.id}</span>
              <span className="text-gray-500">
                {section.top.toFixed(0)}px - {(section.top + section.height).toFixed(0)}px
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SectionDebug
