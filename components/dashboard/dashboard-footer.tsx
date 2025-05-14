"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function DashboardFooter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.footer
      className="border-t border-purple-900/30 py-6 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Five Pillars Token. All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a
            href={`https://bscscan.com/address/0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Contract
          </a>
          <span className="text-gray-600">|</span>
          <a
            href={`https://bscscan.com/token/0x8FafdFB035C9426a50D842873D5d401C933bE09F`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Token
          </a>
        </div>
      </div>
    </motion.footer>
  )
}
