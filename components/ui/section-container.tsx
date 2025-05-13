"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SectionContainerProps {
  id?: string
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function SectionContainer({ id, title, subtitle, children, className = "" }: SectionContainerProps) {
  return (
    <section id={id} className={`py-20 md:py-32 relative overflow-hidden ${className}`}>
      {/* Consistent background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">{title}</span>
          </motion.h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>

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
        </motion.div>

        {children}
      </div>

      {/* Consistent background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[10%] w-32 h-32 rounded-full border border-purple-500/20 animate-rotate"></div>
        <div className="absolute bottom-1/4 left-[10%] w-48 h-48 rounded-full border border-blue-500/20 animate-rotate"></div>
        <div className="absolute top-1/3 left-[20%] w-4 h-4 rounded-full bg-purple-500/20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-[20%] w-4 h-4 rounded-full bg-blue-500/20 animate-pulse"></div>
      </div>
    </section>
  )
}
