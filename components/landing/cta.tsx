"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { ParallaxSection } from "@/components/parallax/parallax-section"
import { TiltCard } from "@/components/parallax/tilt-card"

export function CTA() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Create transforms for parallax effect
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  useEffect(() => {
    setMounted(true)

    if (mounted && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      // Create particles
      const particles: {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
        color: string
      }[] = []

      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.3})`,
        })
      }

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update and draw particles
        particles.forEach((particle) => {
          // Update position
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Wrap around edges
          if (particle.x > canvas.width) particle.x = 0
          if (particle.x < 0) particle.x = canvas.width
          if (particle.y > canvas.height) particle.y = 0
          if (particle.y < 0) particle.y = canvas.height

          // Draw particle
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        })

        requestAnimationFrame(animate)
      }

      animate()

      return () => {
        window.removeEventListener("resize", resizeCanvas)
      }
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/20 to-black/80"></div>

      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: y1, opacity }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]" />
          <div className="absolute top-[50%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-[80px]" />
          <div className="absolute top-[10%] right-[20%] w-[35%] h-[35%] rounded-full bg-indigo-900/10 blur-[90px]" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <ParallaxSection intensity={0.4}>
          <div className="max-w-4xl mx-auto">
            <TiltCard intensity={5} perspective={1500} glareOpacity={0.3}>
              <div className="relative bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-12 overflow-hidden">
                {/* Background canvas */}
                <canvas ref={canvasRef} className="absolute inset-0" />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <motion.h2
                    className="text-4xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-white">BE AN </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                      EARLY INVESTOR
                    </span>
                  </motion.h2>

                  <motion.div
                    className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"
                    initial={{ width: 0 }}
                    whileInView={{ width: "6rem" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  ></motion.div>

                  <motion.p
                    className="text-xl text-gray-300 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Join the Five Pillars Token investment platform at launch and position yourself for maximum rewards.
                  </motion.p>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h3 className="text-purple-400 font-bold mb-1">Early Access</h3>
                      <p className="text-gray-300 text-sm">Be first to access all 9 investment pools</p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h3 className="text-purple-400 font-bold mb-1">Referral Advantage</h3>
                      <p className="text-gray-300 text-sm">Build your network from day one</p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h3 className="text-purple-400 font-bold mb-1">Whitelist Potential</h3>
                      <p className="text-gray-300 text-sm">Opportunity for exclusive pool access</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Link href="/dashboard">
                      <button className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg overflow-hidden group">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-50 transition-opacity"></span>
                        <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="w-8 h-8 bg-white/20 rounded-full animate-ping"></span>
                        </span>
                        <span className="relative flex items-center justify-center text-white font-bold">
                          Launch App
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </Link>

                    <a href="https://t.me/5PTFinance" target="_blank" rel="noopener noreferrer">
                      <button className="px-8 py-4 bg-transparent border border-purple-500/50 rounded-lg text-purple-400 font-bold hover:bg-purple-500/10 transition-colors">
                        Join Community
                      </button>
                    </a>
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl"></div>
              </div>
            </TiltCard>
          </div>
        </ParallaxSection>
      </div>
    </section>
  )
}

export default CTA
