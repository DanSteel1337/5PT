import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 30px rgba(0, 240, 255, 0.8)" },
        },
        "data-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "data-flow": "data-flow 15s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-gradient": "linear-gradient(to right, #00f0ff, #aa00ff, #ff00aa, #00f0ff)",
        "shimmer-gradient":
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,240,255,0.2) 25%, rgba(0,240,255,0.5) 50%, rgba(0,240,255,0.2) 75%, rgba(255,255,255,0) 100%)",
        "dark-gradient": "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4))",
        "card-gradient": "linear-gradient(135deg, rgba(0,240,255,0.05) 0%, rgba(0,0,0,0) 100%)",
        "data-flow":
          "linear-gradient(90deg, rgba(0,240,255,0.1), rgba(170,0,255,0.1), rgba(255,0,170,0.1), rgba(0,240,255,0.1))",
      },
      boxShadow: {
        "cyber-sm": "0 1px 2px 0 rgba(0,240,255,0.05)",
        "cyber-md": "0 4px 6px -1px rgba(0,240,255,0.1), 0 2px 4px -1px rgba(0,240,255,0.06)",
        "cyber-lg": "0 10px 15px -3px rgba(0,240,255,0.1), 0 4px 6px -2px rgba(0,240,255,0.05)",
        "cyber-xl": "0 20px 25px -5px rgba(0,240,255,0.1), 0 10px 10px -5px rgba(0,240,255,0.04)",
        "cyber-2xl": "0 25px 50px -12px rgba(0,240,255,0.25)",
        "cyber-inner": "inset 0 2px 4px 0 rgba(0,240,255,0.06)",
      },
      // Chart colors
      chart: {
        1: "var(--chart-1)",
        2: "var(--chart-2)",
        3: "var(--chart-3)",
        4: "var(--chart-4)",
        5: "var(--chart-5)",
        6: "var(--chart-6)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
