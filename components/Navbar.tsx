"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { Logo } from "@/components/shared/logo"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Set mounted first to prevent any hydration issues
    setMounted(true)

    // Add event listener only on client side
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      // Initial check for scroll position
      handleScroll()
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo - Only show once */}
        <div className="z-10">
          <Logo size={36} className="py-1" href="/" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NavLink href="/" label="Home" />
            <NavLink href="/#features" label="Features" />
            <NavLink href="/#tokenomics" label="Tokenomics" />
            <NavLink href="/#roadmap" label="Roadmap" />
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-transparent border border-purple-500/50 rounded-lg text-purple-400 font-medium hover:bg-purple-500/10 transition-colors">
                Dashboard
              </button>
            </Link>
            {/* Network information and wallet connect in one area */}
            <div className="flex items-center gap-2">
              <CustomConnectButton />
            </div>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/dashboard">
            <button className="px-3 py-1.5 bg-transparent border border-purple-500/50 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors">
              Dashboard
            </button>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 bg-black/30 rounded-lg backdrop-blur-sm"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <MobileNavLink href="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/#features" label="Features" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/#tokenomics" label="Tokenomics" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/#roadmap" label="Roadmap" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="pt-2 flex flex-col gap-3">
                <CustomConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function NavLink({ href, label }) {
  return (
    <Link href={href} className="relative text-white/80 hover:text-white transition-colors group">
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  )
}

function MobileNavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      className="text-white/80 hover:text-white py-2 transition-colors border-b border-purple-900/20"
      onClick={onClick}
    >
      {label}
    </Link>
  )
}

export default Navbar
