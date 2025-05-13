"use client"

import { type ReactNode, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  id?: string
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export const SectionContainer = forwardRef<HTMLElement, SectionContainerProps>(
  ({ id, title, subtitle, children, className }, ref) => {
    return (
      <section id={id} ref={ref} className={cn("py-20 md:py-32 relative overflow-hidden", className)}>
        {(title || subtitle) && (
          <div className="text-center mb-16 px-4 md:px-6 lg:px-8">
            {title && (
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {title}
                </span>
              </motion.h2>
            )}

            {title && (
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              ></motion.div>
            )}

            {subtitle && (
              <motion.p
                className="text-xl text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6 lg:px-8">{children}</div>
      </section>
    )
  },
)

SectionContainer.displayName = "SectionContainer"
