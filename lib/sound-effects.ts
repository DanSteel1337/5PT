// Sound effect utility for the dashboard

// Use a different name for the class to avoid naming conflicts
class SoundEffectsManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled = true

  constructor() {
    // Pre-load common sounds if in browser environment
    if (typeof window !== "undefined") {
      this.preload("engine-start", "/sounds/engine-start.mp3")
      this.preload("button-click", "/sounds/button-click.mp3")
      this.preload("success", "/sounds/success.mp3")
      this.preload("error", "/sounds/error.mp3")
      this.preload("notification", "/sounds/notification.mp3")
    }
  }

  preload(name: string, path: string): void {
    if (typeof window === "undefined") return

    try {
      const audio = new Audio(path)
      audio.load()
      this.sounds.set(name, audio)
    } catch (error) {
      console.error(`Failed to preload sound: ${name}`, error)
    }
  }

  play(name: string, volume = 0.5): void {
    if (typeof window === "undefined" || !this.enabled) return

    try {
      const sound = this.sounds.get(name)
      if (sound) {
        // Create a clone to allow overlapping sounds
        const clone = sound.cloneNode() as HTMLAudioElement
        clone.volume = volume
        clone.play().catch((err) => {
          // Suppress errors from browsers that require user interaction
          console.debug("Sound playback error (likely requires user interaction):", err)
        })
      } else {
        console.warn(`Sound not found: ${name}`)
      }
    } catch (error) {
      console.error(`Failed to play sound: ${name}`, error)
    }
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  toggle(): boolean {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }
}

// Create a singleton instance
const soundEffectsInstance = typeof window !== "undefined" ? new SoundEffectsManager() : null

// Export functions instead of the class to avoid redeclaration issues
export const SoundEffects = {
  play: (name: string, volume = 0.5) => soundEffectsInstance?.play(name, volume),
  enable: () => soundEffectsInstance?.enable(),
  disable: () => soundEffectsInstance?.disable(),
  toggle: () => soundEffectsInstance?.toggle() || false,
  isEnabled: () => soundEffectsInstance?.isEnabled() || false,
  preload: (name: string, path: string) => soundEffectsInstance?.preload(name, path),
}
