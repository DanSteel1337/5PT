"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SoundEffects } from "@/lib/sound-effects"

export function SystemStatus() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [networkLatency, setNetworkLatency] = useState(0)
  const [securityStatus, setSecurityStatus] = useState(0)
  const [blockchainSync, setBlockchainSync] = useState(0)
  const [powerUsage, setPowerUsage] = useState(0)

  // Simulate changing system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 40) + 10)
      setMemoryUsage(Math.floor(Math.random() * 30) + 20)
      setNetworkLatency(Math.floor(Math.random() * 100) + 20)
      setSecurityStatus(Math.floor(Math.random() * 20) + 80)
      setBlockchainSync(Math.floor(Math.random() * 5) + 95)
      setPowerUsage(Math.floor(Math.random() * 30) + 30)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)

    if (SoundEffects) {
      if (newState) {
        SoundEffects.enable()
        SoundEffects.play("button-click", 0.2)
      } else {
        SoundEffects.play("button-click", 0.2)
        SoundEffects.disable()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-300">System Status</h2>

        <button
          className={`px-4 py-1 text-xs rounded-lg border ${
            soundEnabled
              ? "bg-green-900/30 border-green-500/50 text-green-300"
              : "bg-red-900/30 border-red-500/50 text-red-300"
          }`}
          onClick={toggleSound}
        >
          Sound: {soundEnabled ? "ON" : "OFF"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-blue-500/30 p-4">
          <h3 className="text-sm font-medium text-blue-300 mb-3">CPU Usage</h3>
          <div className="flex items-end space-x-1 h-32 mb-2">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-blue-500/80 rounded-sm"
                initial={{ height: 0 }}
                animate={{
                  height:
                    Math.random() < 0.7
                      ? `${Math.max(5, cpuUsage - 5 + Math.random() * 10)}%`
                      : `${Math.max(2, cpuUsage - 15 + Math.random() * 5)}%`,
                }}
                transition={{ duration: 0.4 }}
              ></motion.div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-blue-400">
            <span>Current: {cpuUsage}%</span>
            <span>Threshold: 80%</span>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-4">
          <h3 className="text-sm font-medium text-purple-300 mb-3">Memory Usage</h3>
          <div className="relative h-32 flex items-center justify-center mb-2">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1e1b4b" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="8"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{
                  strokeDashoffset: 251.2 - (251.2 * memoryUsage) / 100,
                }}
                transition={{ duration: 0.8 }}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-2xl font-bold text-purple-300">{memoryUsage}%</div>
              <div className="text-xs text-purple-400">Used</div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-purple-400">
            <span>Available: {100 - memoryUsage}%</span>
            <span>Total: 16GB</span>
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-500/30 p-4">
          <h3 className="text-sm font-medium text-cyan-300 mb-3">Network Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-cyan-400">Latency</span>
                <span className="text-xs font-bold text-cyan-200">{networkLatency} ms</span>
              </div>
              <div className="w-full bg-cyan-900/30 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(networkLatency / 2, 100)}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-cyan-400">Security Status</span>
                <span className="text-xs font-bold text-cyan-200">{securityStatus}%</span>
              </div>
              <div className="w-full bg-cyan-900/30 rounded-full h-1.5">
                <motion.div
                  className={`h-1.5 rounded-full ${
                    securityStatus > 90
                      ? "bg-gradient-to-r from-green-500 to-cyan-500"
                      : securityStatus > 70
                        ? "bg-gradient-to-r from-yellow-500 to-green-500"
                        : "bg-gradient-to-r from-red-500 to-yellow-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${securityStatus}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-cyan-400">Blockchain Sync</span>
                <span className="text-xs font-bold text-cyan-200">{blockchainSync}%</span>
              </div>
              <div className="w-full bg-cyan-900/30 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${blockchainSync}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Power Usage */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-green-500/30 p-4 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-medium text-green-300 mb-3">Power Usage</h3>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0f2318" strokeWidth="10" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="10"
                  strokeDasharray="282.6"
                  initial={{ strokeDashoffset: 282.6 }}
                  animate={{
                    strokeDashoffset: 282.6 - (282.6 * powerUsage) / 100,
                  }}
                  transition={{ duration: 0.8 }}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-lg font-bold text-green-300">{powerUsage}%</div>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <div className="text-xs text-green-400 mb-1">Current Draw</div>
                <div className="text-lg font-bold">{(powerUsage / 10).toFixed(1)} W</div>
              </div>

              <div>
                <div className="text-xs text-green-400 mb-1">Efficiency</div>
                <div className="text-lg font-bold">{100 - Math.floor(powerUsage / 2)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Log */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-gray-500/30 p-4 md:col-span-2">
          <h3 className="text-sm font-medium text-gray-300 mb-3">System Log</h3>
          <div className="bg-black/50 rounded-lg p-3 h-40 overflow-y-auto font-mono text-xs text-gray-400 space-y-1">
            <div className="flex">
              <span className="text-green-500 mr-2">[INFO]</span>
              <span>System initialized successfully</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[CONN]</span>
              <span>Connected to BSC network</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[CONN]</span>
              <span>Investment Manager contract loaded</span>
            </div>
            <div className="flex">
              <span className="text-yellow-500 mr-2">[WARN]</span>
              <span>Network latency spike detected (120ms)</span>
            </div>
            <div className="flex">
              <span className="text-green-500 mr-2">[INFO]</span>
              <span>User data synchronized</span>
            </div>
            <div className="flex">
              <span className="text-purple-500 mr-2">[DATA]</span>
              <span>Pool qualification status updated</span>
            </div>
            <div className="flex">
              <span className="text-green-500 mr-2">[INFO]</span>
              <span>Dashboard rendering complete</span>
            </div>
            <div className="flex">
              <span className="text-blue-500 mr-2">[CONN]</span>
              <span>WebSocket connection established</span>
            </div>
            <div className="flex">
              <span className="text-purple-500 mr-2">[DATA]</span>
              <span>Real-time data stream active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
