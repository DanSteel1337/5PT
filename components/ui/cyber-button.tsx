import type React from "react"
import { cn } from "@/lib/utils"

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  glitch?: boolean
  children: React.ReactNode
}

export function CyberButton({
  variant = "primary",
  size = "md",
  glitch = false,
  className,
  children,
  ...props
}: CyberButtonProps) {
  const baseStyles = "relative font-bold uppercase transition-all duration-300 overflow-hidden"

  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]",
    secondary: "bg-transparent border border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.3)]",
    outline: "bg-transparent border border-purple-500/50 text-purple-400 hover:bg-purple-500/10",
  }

  const sizeStyles = {
    sm: "text-xs py-2 px-3",
    md: "text-sm py-3 px-5",
    lg: "text-base py-4 px-8",
  }

  const clipPath = "clip-path-[polygon(0_0,100%_0,95%_100%,5%_100%)]"

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        clipPath,
        glitch && "animate-glitch",
        "hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 pointer-events-none" />
      )}
    </button>
  )
}
