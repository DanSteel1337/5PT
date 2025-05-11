// Theme configuration for the application
export const themeConfig = {
  colors: {
    primary: "rgb(0, 240, 255)", // Cyan
    secondary: "rgb(170, 0, 255)", // Purple
    accent: "rgb(255, 0, 170)", // Pink
    background: "rgb(15, 15, 25)", // Dark blue-black
    foreground: "rgb(240, 240, 255)", // Off-white
    card: "rgb(25, 25, 40)", // Dark blue-gray
    muted: "rgb(100, 100, 140)", // Muted purple
    border: "rgb(40, 40, 60)", // Dark border
  },
  gradients: {
    primary: "linear-gradient(90deg, rgb(0, 240, 255), rgb(170, 0, 255))",
    secondary: "linear-gradient(90deg, rgb(170, 0, 255), rgb(255, 0, 170))",
    accent: "linear-gradient(90deg, rgb(255, 0, 170), rgb(0, 240, 255))",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  },
  radii: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "2rem",
    full: "9999px",
  },
}
