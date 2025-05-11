import { type Theme, darkTheme } from "@rainbow-me/rainbowkit"

export const customTheme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "rgba(170, 0, 255, 1)", // Purple accent
    accentColorForeground: "#000000",
    modalBackground: "rgba(25, 25, 40, 0.95)",
    modalBorder: "rgba(170, 0, 255, 0.2)",
    modalText: "#ffffff",
    modalTextSecondary: "rgba(240, 240, 255, 0.6)",
    connectButtonBackground: "rgba(170, 0, 255, 0.8)",
    connectButtonText: "#ffffff",
  },
  fonts: {
    body: "Inter, system-ui, sans-serif",
  },
  radii: {
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "16px",
    modalMobile: "16px",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(170, 0, 255, 0.4)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
  },
}
