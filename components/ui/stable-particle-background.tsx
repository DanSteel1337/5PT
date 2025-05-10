"use client"

import { useRef, useEffect } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  baseSize: number
}

export function StableParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const isInitializedRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 })
  // Add a state to track the logo position
  // const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0, radius: 150 })
  const logoPosition = useRef({ x: 0, y: 0, radius: 150 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Calculate logo position (center of screen)
      logoPosition.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2.5, // Slightly above center for hero section
        radius: Math.min(150, window.innerWidth * 0.15), // Responsive radius
      }

      // Only initialize particles once or when resizing
      if (!isInitializedRef.current) {
        initParticles()
        isInitializedRef.current = true
      }
    }

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    // Initialize particles
    const initParticles = () => {
      if (!canvas) return
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 150)
      const particles: Particle[] = []

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height

        particles.push({
          x,
          y,
          size: size,
          baseSize: size,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          color: getRandomGoldShade(),
        })
      }

      particlesRef.current = particles
    }

    // Get random gold shade
    const getRandomGoldShade = () => {
      const goldShades = [
        "rgba(255, 215, 0, 1)", // Gold
        "rgba(218, 165, 32, 1)", // GoldenRod
        "rgba(207, 181, 59, 1)", // Old Gold
        "rgba(255, 223, 0, 1)", // Gold Yellow
        "rgba(212, 175, 55, 1)", // Metallic Gold
      ]
      return goldShades[Math.floor(Math.random() * goldShades.length)]
    }

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Calculate distance between mouse and particle
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Interactive effect when mouse is close to particles
        if (distance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius

          // Increase size and opacity when mouse is near
          particle.size = particle.baseSize * (1 + force)

          // Add slight repulsion
          const angle = Math.atan2(dy, dx)
          particle.x -= Math.cos(angle) * force * 0.5
          particle.y -= Math.sin(angle) * force * 0.5
        } else {
          // Return to base size
          particle.size = particle.baseSize
        }

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace("1)", `${particle.opacity})`)
        ctx.fill()

        // Connect particles with lines if they are close enough
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return // Skip self

          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 - distance / 1000})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Set up canvas and start animation
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    handleResize()
    animate()

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, []) // Empty dependency array - only run once on mount

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.7 }} />
}
