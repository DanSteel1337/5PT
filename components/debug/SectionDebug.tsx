"use client"

import { useState, useEffect } from "react"

export function SectionDebug() {
  const [sections, setSections] = useState<HTMLElement[]>([])
  const [computedStyles, setComputedStyles] = useState<Record<string, any>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Find all section elements
    const allSections = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[]
    setSections(allSections)

    // Get computed styles for each section
    const styles: Record<string, any> = {}
    allSections.forEach((section) => {
      if (section.id) {
        const computed = window.getComputedStyle(section)
        const firstChild = section.querySelector("div")
        const firstChildStyle = firstChild ? window.getComputedStyle(firstChild) : null

        styles[section.id] = {
          section: {
            backgroundColor: computed.backgroundColor,
            opacity: computed.opacity,
            backdropFilter: computed.backdropFilter,
            position: computed.position,
            zIndex: computed.zIndex,
          },
          firstChild: firstChildStyle
            ? {
                backgroundColor: firstChildStyle.backgroundColor,
                opacity: firstChildStyle.opacity,
                backdropFilter: firstChildStyle.backdropFilter,
                position: firstChildStyle.position,
                zIndex: firstChildStyle.zIndex,
              }
            : null,
        }
      }
    })

    setComputedStyles(styles)
  }, [isVisible])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-md z-50"
      >
        Debug Sections
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/90 text-white p-4 overflow-auto z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Section Debug Information</h2>
          <button onClick={() => setIsVisible(false)} className="bg-red-600 text-white px-4 py-2 rounded-md">
            Close
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Section ID: {section.id}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Section Styles:</h4>
                  <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(computedStyles[section.id]?.section || {}, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-1">First Child Styles:</h4>
                  <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(computedStyles[section.id]?.firstChild || {}, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-1">DOM Structure:</h4>
                <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">
                  {section.outerHTML.slice(0, 500) + "..."}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
