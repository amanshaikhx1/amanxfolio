"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

const SpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleReducedMotionChange)

    const detectDeviceCapabilities = () => {
      const isLowEnd =
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.devicePixelRatio && window.devicePixelRatio < 2)
      setIsLowEndDevice(!!isLowEnd)
    }

    detectDeviceCapabilities()

    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange)
    }
  }, [])

  useEffect(() => {
    if (!mounted || prefersReducedMotion || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      const dpr = isLowEndDevice ? 1 : window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    const getStarCount = () => {
      const baseCount = isLowEndDevice ? 100 : 300
      const screenSizeFactor = Math.min(window.innerWidth, window.innerHeight) / 1000
      return Math.floor(baseCount * screenSizeFactor) + 50
    }

    class Star {
      x: number
      y: number
      size: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 2 + 0.5

        const colorType = Math.random()
        if (colorType > 0.7) {
          this.color = `rgba(200, 220, 255, 0.8)`
        } else if (colorType > 0.4) {
          this.color = `rgba(255, 255, 220, 0.8)`
        } else {
          this.color = `rgba(255, 255, 255, 0.8)`
        }
      }

      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fillStyle = this.color
        ctx!.fill()
      }
    }

    class Nebula {
      x: number
      y: number
      size: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 300 + 100
        this.opacity = Math.random() * 0.15 + 0.05

        const colorType = Math.random()
        if (colorType > 0.7) {
          this.color = `rgba(130, 80, 170, ${this.opacity})`
        } else if (colorType > 0.4) {
          this.color = `rgba(70, 100, 180, ${this.opacity})`
        } else if (colorType > 0.2) {
          this.color = `rgba(70, 180, 170, ${this.opacity})`
        } else {
          this.color = `rgba(180, 70, 120, ${this.opacity})`
        }
      }

      draw() {
        const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
        gradient.addColorStop(0, this.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx!.beginPath()
        ctx!.fillStyle = gradient
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    const stars: Star[] = []
    const nebulae: Nebula[] = []

    const initScene = () => {
      stars.length = 0
      nebulae.length = 0

      const starCount = getStarCount()
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star())
      }

      const nebulaCount = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < nebulaCount; i++) {
        nebulae.push(new Nebula())
      }
    }

    const renderScene = () => {
      ctx!.fillStyle = theme === "dark" ? "rgba(10, 10, 20, 1)" : "rgba(20, 20, 40, 1)"
      ctx!.fillRect(0, 0, window.innerWidth, window.innerHeight)

      nebulae.forEach((nebula) => nebula.draw())
      stars.forEach((star) => star.draw())
    }

    const handleResize = () => {
      updateCanvasSize()
      initScene()
      renderScene()
    }

    updateCanvasSize()
    initScene()
    renderScene()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mounted, prefersReducedMotion, theme, isLowEndDevice])

  if (!mounted || prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(to bottom, #0a0a14, #141428)"
            : "linear-gradient(to bottom, #141428, #1a1a32)",
      }}
    />
  )
}

export default SpaceBackground
