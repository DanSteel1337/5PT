export interface AnimationVariants {
  initial?: Record<string, any>
  animate?: Record<string, any>
  exit?: Record<string, any>
  hover?: Record<string, any>
  tap?: Record<string, any>
  whileInView?: Record<string, any>
}

export const easings = {
  // Smooth easing functions
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],

  // Spring-like easings
  spring: { type: "spring", stiffness: 400, damping: 30 },
  gentleSpring: { type: "spring", stiffness: 200, damping: 20 },
  bouncy: { type: "spring", stiffness: 300, damping: 10 },

  // Duration-based easings
  fast: { duration: 0.2 },
  normal: { duration: 0.4 },
  slow: { duration: 0.6 },
}

export const fadeIn: AnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export const slideUp: AnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easings.easeOutExpo } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
}

export const slideIn: AnimationVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easings.easeOutExpo } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
}

export const scale: AnimationVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easings.easeOutExpo } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
}

export const staggerChildren = (staggerTime = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: staggerTime,
    },
  },
})
