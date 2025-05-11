// Custom process polyfill for browser environments
if (typeof window !== "undefined" && !window.process) {
  window.process = {
    env: {
      NODE_ENV: process.env.NODE_ENV || "development",
    },
    browser: true,
  }
}

export {}
