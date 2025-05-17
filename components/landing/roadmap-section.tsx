"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { SectionContainer } from "@/components/ui/section-container"
import { cn } from "@/lib/utils"

// Reorganized roadmap data - removed duplicate entry and renumbered
const roadmapItems = [
  {
    number: "01",
    title: "Start Five Pillars Presale Phase",
    date: "May 25, 2025",
  },
  {
    number: "02",
    title: "Official Launch of Five Pillars Token Sale",
    date: "June 1, 2025",
  },
  {
    number: "03",
    title: "1st Rollout of Five Pillars Crypto Debit Cards",
    date: "June 10, 2025",
  },
  {
    number: "04",
    title: "Launch of Five Pillars Smart Lottery",
    date: "July 15, 2025",
  },
  {
    number: "05",
    title: "End of Token Sale",
    date: "October 1, 2025",
  },
  {
    number: "06",
    title: "Exchange Listing of Five Pillars Token",
    date: "October 15, 2025",
  },
]

// Pre-generate random values for particles to avoid updates during render
const particles = Array.from({ length: 15 }).map(() => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${5 + Math.random() * 10}s`,
}))

export function RoadmapSection() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Use refs to store event handlers
  const handleMouseEnter = useRef((index: number) => {
    setActiveIndex(index)
  }).current

  const handleMouseLeave = useRef(() => {
    setActiveIndex(null)
  }).current

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <SectionContainer
      id="roadmap"
      title="ROADMAP"
      subtitle="Our strategic plan for the Five Pillars Token ecosystem"
      className="relative overflow-hidden"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-black/20 bg-grid opacity-20 pointer-events-none"></div>

      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 transform -translate-x-1/2 hidden md:block"></div>

      {/* Mobile timeline line */}
      <div className="absolute left-[30px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 md:hidden"></div>

      {/* Roadmap items */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {roadmapItems.map((item, index) => {
          // Pre-compute classes to avoid conditional logic during render
          const timelineNodeClasses = cn(
            "absolute top-0 w-6 h-6 rounded-full bg-black border-2 border-purple-500 z-20 transform -translate-y-1/2",
            "transition-all duration-300 ease-out",
            activeIndex === index ? "scale-150 border-blue-400 shadow-[0_0_15px_rgba(139,92,246,0.8)]" : "",
            index % 2 === 0
              ? "md:right-0 md:translate-x-1/2 left-[30px] -translate-x-1/2"
              : "md:left-0 md:-translate-x-1/2 left-[30px] -translate-x-1/2",
          )

          const cardClasses = cn(
            "bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 md:p-8 relative overflow-hidden transition-all duration-300",
            "hover:bg-black/60 group-hover:border-purple-400/40",
            index % 2 === 0 ? "md:mr-10 ml-16 md:ml-0" : "md:ml-10 ml-16 md:mr-0",
          )

          return (
            <motion.div
              key={index}
              className={cn(
                "relative mb-16 md:mb-24 group",
                index % 2 === 0 ? "md:pr-[50%] text-left" : "md:pl-[50%] md:text-right text-left",
              )}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline node */}
              <div
                className={timelineNodeClasses}
                role="button"
                tabIndex={0}
                aria-label={`Timeline milestone ${index + 1}: ${item.title}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleMouseEnter(index)
                  }
                }}
              >
                <div className="absolute inset-1 bg-purple-900 rounded-full"></div>
              </div>

              {/* Content card */}
              <div className={cardClasses}>
                {/* Animated corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/30 to-transparent transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Number */}
                <div className="flex items-center mb-3">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mr-3">
                    {item.number}
                  </span>
                  <div className="h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{item.title}</h3>

                {/* Date */}
                <div className="inline-block px-4 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-sm font-medium text-purple-300">
                  {item.date}
                </div>

                {/* Hover effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Animated particles - using pre-generated random values */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500/40 animate-float"
          style={{
            top: particle.top,
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
          aria-hidden="true"
        />
      ))}
    </SectionContainer>
  )
}
