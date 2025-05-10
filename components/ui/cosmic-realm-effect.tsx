"use client"

import { useRef, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"

interface CosmicObject {
  x: number
  y: number
  z: number
  size: number
  rotationSpeed: number
  orbitRadius: number
  orbitSpeed: number
  orbitAngle: number
  color: string
  glow: number
  type: "planet" | "star" | "nebula" | "comet"
  trail: { x: number; y: number; opacity: number }[]
}

export function CosmicRealmEffect({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cosmicObjectsRef = useRef<CosmicObject[]>([])
  const animationFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const { address } = useAccount()
  const { useInvestorInfo } = useInvestmentManager()
  const { data: investorInfo } = useInvestorInfo(address)

  // Determine cosmic realm properties based on user's investment data
  const [objectDensity, setObjectDensity] = useState(30)
  const [realmIntensity, setRealmIntensity] = useState(0.5)
  const [realmScale, setRealmScale] = useState(1.0)
  const [timeWarp, setTimeWarp] = useState(1.0)

  useEffect(() => {
    if (investorInfo) {
      // Calculate cosmic properties based on investment activity
      const totalDeposit = Number(investorInfo[0] || 0n)
      const directRefs = Number(investorInfo[1] || 0n)

      // More investment = more cosmic objects
      const calculatedDensity = Math.min(100, 30 + (totalDeposit / 1000000000000000000) * 15 + directRefs * 3)
      setObjectDensity(calculatedDensity)

      // More investment = more intense glow and effects
      const calculatedIntensity = Math.min(1.5, 0.5 + (totalDeposit / 1000000000000000000) * 0.1 + directRefs * 0.02)
      setRealmIntensity(calculatedIntensity)

      // More investment = larger cosmic realm
      const calculatedScale = Math.min(2.0, 1.0 + (totalDeposit / 1000000000000000000) * 0.05 + directRefs * 0.01)
      setRealmScale(calculatedScale)

      // More investment = faster time flow in the cosmic realm
      const calculatedTimeWarp = Math.min(2.0, 1.0 + (totalDeposit / 5000000000000000000) * 0.5)
      setTimeWarp(calculatedTimeWarp)
    }
  }, [investorInfo])

  const getCosmicColor = () => {
    // Gold-centric cosmic color palette with occasional rare colors
    const colors = [
      // Gold spectrum
      "rgba(255, 215, 0, 0.8)", // Gold
      "rgba(218, 165, 32, 0.8)", // Golden Rod
      "rgba(184, 134, 11, 0.8)", // Dark Golden Rod
      "rgba(212, 175, 55, 0.8)", // Metallic Gold
      "rgba(255, 223, 0, 0.8)", // Gold Yellow

      // Rare cosmic colors (lower probability)
      "rgba(138, 43, 226, 0.7)", // Blue Violet (rare)
      "rgba(0, 191, 255, 0.7)", // Deep Sky Blue (rare)
      "rgba(220, 20, 60, 0.7)", // Crimson (rare)
      "rgba(50, 205, 50, 0.7)", // Lime Green (rare)
    ]

    // 80% chance of gold spectrum, 20% chance of rare colors
    const isRare = Math.random() > 0.8
    if (isRare) {
      return colors[Math.floor(Math.random() * colors.length)]
    } else {
      return colors[Math.floor(Math.random() * 5)] // Only gold spectrum
    }
  }

  const initCosmicRealm = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cosmicObjects: CosmicObject[] = []

    // Create cosmic objects
    for (let i = 0; i < objectDensity; i++) {
      const type = getObjectType(i)
      const size = getObjectSize(type)
      const z = Math.random() * 1000 - 500 // z-position for 3D effect

      const object: CosmicObject = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: z,
        size: size,
        rotationSpeed: (Math.random() - 0.5) * 0.01 * timeWarp,
        orbitRadius: Math.random() * 100 * realmScale + 50,
        orbitSpeed: (Math.random() * 0.005 + 0.001) * timeWarp,
        orbitAngle: Math.random() * Math.PI * 2,
        color: getCosmicColor(),
        glow: Math.random() * 0.5 * realmIntensity + 0.5,
        type: type,
        trail: type === "comet" ? Array(20).fill({ x: 0, y: 0, opacity: 0 }) : [],
      }

      cosmicObjects.push(object)
    }

    cosmicObjectsRef.current = cosmicObjects
  }

  const getObjectType = (index: number): "planet" | "star" | "nebula" | "comet" => {
    // Distribution of cosmic object types
    if (index < objectDensity * 0.6) return "star" // 60% stars
    if (index < objectDensity * 0.8) return "planet" // 20% planets
    if (index < objectDensity * 0.95) return "nebula" // 15% nebulae
    return "comet" // 5% comets
  }

  const getObjectSize = (type: "planet" | "star" | "nebula" | "comet"): number => {
    switch (type) {
      case "star":
        return Math.random() * 2 + 1
      case "planet":
        return Math.random() * 4 + 3
      case "nebula":
        return Math.random() * 15 + 10
      case "comet":
        return Math.random() * 3 + 2
      default:
        return 2
    }
  }

  const renderCosmicRealm = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with a slight fade effect for trails
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Sort objects by z-index for proper 3D rendering
    const sortedObjects = [...cosmicObjectsRef.current].sort((a, b) => a.z - b.z)

    // Render cosmic objects
    sortedObjects.forEach((object) => {
      // Calculate perspective scaling based on z-position
      const scale = 1 + object.z / 1000
      const size = object.size * scale * realmScale

      // Update orbit position
      object.orbitAngle += object.orbitSpeed
      const orbitX = Math.cos(object.orbitAngle) * object.orbitRadius
      const orbitY = Math.sin(object.orbitAngle) * object.orbitRadius

      // Calculate final position
      const x = object.x + orbitX
      const y = object.y + orbitY

      // Update trail for comets
      if (object.type === "comet") {
        object.trail.pop() // Remove last trail point
        object.trail.unshift({ x, y, opacity: 1 }) // Add new trail point
      }

      // Render based on object type
      switch (object.type) {
        case "star":
          renderStar(ctx, x, y, size, object.color, object.glow)
          break
        case "planet":
          renderPlanet(ctx, x, y, size, object.color, object.glow)
          break
        case "nebula":
          renderNebula(ctx, x, y, size, object.color, object.glow)
          break
        case "comet":
          renderComet(ctx, object, size)
          break
      }

      // Interaction with mouse
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - x
        const dy = mouseRef.current.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          // Gravitational pull effect
          object.orbitRadius += (150 - distance) * 0.01
          object.glow = Math.min(2, object.glow + 0.05)

          // Create energy connection line
          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 215, 0, ${(1 - distance / 100) * 0.3})`
            ctx.lineWidth = (1 - distance / 100) * 2
            ctx.moveTo(x, y)
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
            ctx.stroke()
          }
        }
      }
    })

    // Occasionally add cosmic events
    if (Math.random() < 0.01 * timeWarp) {
      createCosmicEvent(ctx, canvas.width, canvas.height)
    }

    animationFrameRef.current = requestAnimationFrame(renderCosmicRealm)
  }

  const renderStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    glow: number,
  ) => {
    // Star glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3 * glow)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(x, y, size * 3 * glow, 0, Math.PI * 2)
    ctx.fill()

    // Star core
    ctx.beginPath()
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
    ctx.fill()

    // Random twinkle effect
    if (Math.random() < 0.05) {
      ctx.beginPath()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 0.5

      // Draw random light rays
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(angle) * size * 5, y + Math.sin(angle) * size * 5)
      }
      ctx.stroke()
    }
  }

  const renderPlanet = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    glow: number,
  ) => {
    // Planet glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2 * glow)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(x, y, size * 2 * glow, 0, Math.PI * 2)
    ctx.fill()

    // Planet body
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    // Planet surface details
    ctx.beginPath()
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.5, 0, Math.PI * 2)
    ctx.fill()
  }

  const renderNebula = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    glow: number,
  ) => {
    // Create cloud-like nebula
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * glow)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.7, color.replace("0.8", "0.3"))
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.beginPath()
    ctx.fillStyle = gradient

    // Create irregular shape
    ctx.moveTo(x, y)
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const radius = size * (0.8 + Math.sin(angle * 5) * 0.2)
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius)
    }
    ctx.closePath()
    ctx.fill()

    // Add some stars inside nebula
    for (let i = 0; i < 5; i++) {
      const starX = x + (Math.random() - 0.5) * size
      const starY = y + (Math.random() - 0.5) * size
      const starSize = Math.random() * 1 + 0.5

      ctx.beginPath()
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.arc(starX, starY, starSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const renderComet = (ctx: CanvasRenderingContext2D, comet: CosmicObject, size: number) => {
    // Render comet trail
    comet.trail.forEach((point, index) => {
      if (point.opacity <= 0) return

      const trailSize = size * (1 - index / comet.trail.length)
      const opacity = point.opacity * (1 - index / comet.trail.length)

      ctx.beginPath()
      ctx.fillStyle = comet.color.replace("0.8", opacity.toString())
      ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2)
      ctx.fill()

      // Fade trail over time
      comet.trail[index].opacity -= 0.05
    })

    // Render comet head
    const x = comet.x + Math.cos(comet.orbitAngle) * comet.orbitRadius
    const y = comet.y + Math.sin(comet.orbitAngle) * comet.orbitRadius

    // Comet glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3 * comet.glow)
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
    gradient.addColorStop(0.3, comet.color)
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(x, y, size * 3 * comet.glow, 0, Math.PI * 2)
    ctx.fill()

    // Comet core
    ctx.beginPath()
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.arc(x, y, size * 0.7, 0, Math.PI * 2)
    ctx.fill()
  }

  const createCosmicEvent = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Random cosmic events like supernovas or wormholes
    const eventType = Math.random() > 0.5 ? "supernova" : "wormhole"
    const x = Math.random() * width
    const y = Math.random() * height

    if (eventType === "supernova") {
      // Create supernova explosion
      const colors = [
        "rgba(255, 255, 255, 0.8)",
        "rgba(255, 215, 0, 0.7)",
        "rgba(255, 165, 0, 0.6)",
        "rgba(255, 69, 0, 0.5)",
      ]

      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (!ctx) return

          const radius = (i + 1) * 30 * realmIntensity
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
          gradient.addColorStop(0, colors[i])
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

          ctx.beginPath()
          ctx.fillStyle = gradient
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()

          // Create shock wave
          ctx.beginPath()
          ctx.strokeStyle = "rgba(255, 255, 255, " + (0.5 - i * 0.1) + ")"
          ctx.lineWidth = 2
          ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2)
          ctx.stroke()
        }, i * 200)
      }
    } else {
      // Create wormhole effect
      const radius = 50 * realmIntensity
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, "rgba(138, 43, 226, 0.8)")
      gradient.addColorStop(0.5, "rgba(75, 0, 130, 0.6)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Create spiral effect
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 255, " + (0.5 - i * 0.1) + ")"
        ctx.lineWidth = 1

        for (let angle = 0; angle < Math.PI * 10; angle += 0.1) {
          const r = (i * 5 + angle) * 2
          const spiralX = x + Math.cos(angle) * r
          const spiralY = y + Math.sin(angle) * r

          if (angle === 0) {
            ctx.moveTo(spiralX, spiralY)
          } else {
            ctx.lineTo(spiralX, spiralY)
          }
        }

        ctx.stroke()
      }
    }
  }

  const handleResize = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    initCosmicRealm()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    handleResize()
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    animationFrameRef.current = requestAnimationFrame(renderCosmicRealm)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [objectDensity, realmIntensity, realmScale, timeWarp])

  return (
    <>
      <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full -z-10 ${className}`} />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/80 pointer-events-none -z-10" />
    </>
  )
}
