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

    const initBackground = () => {
      // Galaxy-like gradient background
      const gradient = ctx!.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(20, 10, 40, 1)") // Deep purple
      gradient.addColorStop(0.3, "rgba(30, 20, 60, 1)") // Dark blue
      gradient.addColorStop(0.6, "rgba(50, 30, 80, 1)") // Medium purple
      gradient.addColorStop(1, "rgba(70, 40, 100, 1)") // Lighter purple with hint of pink
      ctx!.fillStyle = gradient
      ctx!.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Faint nebula effects
      const nebula1 = {
        x: window.innerWidth * 0.3,
        y: window.innerHeight * 0.4,
        size: 200,
        color: "rgba(150, 80, 180, 0.1)" // Soft purple nebula
      }
      const nebula2 = {
        x: window.innerWidth * 0.7,
        y: window.innerHeight * 0.6,
        size: 250,
        color: "rgba(100, 60, 140, 0.08)" // Soft pinkish-purple nebula
      }

      ctx!.beginPath()
      const nebulaGradient1 = ctx!.createRadialGradient(nebula1.x, nebula1.y, 0, nebula1.x, nebula1.y, nebula1.size)
      nebulaGradient1.addColorStop(0, nebula1.color)
      nebulaGradient1.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx!.fillStyle = nebulaGradient1
      ctx!.arc(nebula1.x, nebula1.y, nebula1.size, 0, Math.PI * 2)
      ctx!.fill()

      ctx!.beginPath()
      const nebulaGradient2 = ctx!.createRadialGradient(nebula2.x, nebula2.y, 0, nebula2.x, nebula2.y, nebula2.size)
      nebulaGradient2.addColorStop(0, nebula2.color)
      nebulaGradient2.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx!.fillStyle = nebulaGradient2
      ctx!.arc(nebula2.x, nebula2.y, nebula2.size, 0, Math.PI * 2)
      ctx!.fill()
    }

    class Star {
      x: number
      y: number
      size: number
      color: string
      velocityX: number
      velocityY: number

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 2 + 0.5
        const colorType = Math.random()
        this.color = colorType > 0.7 ? `rgba(200, 220, 255, 0.8)` : colorType > 0.4 ? `rgba(255, 255, 220, 0.8)` : `rgba(255, 255, 255, 0.8)`
        this.velocityX = (Math.random() - 0.5) * 0.2
        this.velocityY = (Math.random() - 0.5) * 0.2
      }

      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fillStyle = this.color
        ctx!.fill()
      }

      update() {
        this.x += this.velocityX
        this.y += this.velocityY
        if (this.x < 0 || this.x > window.innerWidth) this.velocityX = -this.velocityX
        if (this.y < 0 || this.y > window.innerHeight) this.velocityY = -this.velocityY
      }
    }

    class BlackHole {
      x: number
      y: number
      size: number
      rotation: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = 50
        this.rotation = 0
      }

      draw() {
        ctx!.save()
        ctx!.translate(this.x, this.y)
        ctx!.rotate(this.rotation)
        const gradient = ctx!.createRadialGradient(0, 0, 0, 0, 0, this.size)
        gradient.addColorStop(0, `rgba(0, 0, 0, 1)`)
        gradient.addColorStop(0.5, `rgba(20, 20, 40, 0.8)`)
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`)
        ctx!.beginPath()
        ctx!.fillStyle = gradient
        ctx!.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }

      update() {
        this.rotation += 0.01
      }
    }

    const planets = [
      { x: 100, y: 200, size: 15, color: `rgba(139, 69, 19, 0.7)`, speedX: 0.1, speedY: 0.05, rotation: 0, rotationSpeed: 0.01, hasRings: true, ringColor: `rgba(255, 255, 255, 0.3)` },
      { x: 500, y: 150, size: 18, color: `rgba(65, 105, 225, 0.7)`, speedX: 0.05, speedY: -0.07, rotation: 0, rotationSpeed: 0.01, hasRings: true, ringColor: `rgba(255, 255, 255, 0.3)` }
    ]

    const asteroids = [
      { x: 150, y: 350, size: 8, speedX: 0.15, speedY: 0.1, rotation: 0, rotationSpeed: 0.02 },
      { x: 400, y: 100, size: 6, speedX: -0.12, speedY: 0.08, rotation: 0, rotationSpeed: 0.02 },
      { x: 600, y: 250, size: 10, speedX: 0.09, speedY: -0.05, rotation: 0, rotationSpeed: 0.02 },
      { x: 800, y: 450, size: 7, speedX: -0.1, speedY: 0.06, rotation: 0, rotationSpeed: 0.02 },
      { x: 950, y: 600, size: 9, speedX: 0.13, speedY: -0.03, rotation: 0, rotationSpeed: 0.02 }
    ]

    const stars: Star[] = []
    const blackHoles: BlackHole[] = [
      new BlackHole(window.innerWidth * 0.2, window.innerHeight * 0.7),
      new BlackHole(window.innerWidth * 0.6, window.innerHeight * 0.4)
    ]

    const starCount = isLowEndDevice ? 100 : 300
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star())
    }

    const initScene = () => {
      updateCanvasSize()
      initBackground()
    }

    const renderScene = () => {
      ctx!.fillStyle = theme === "dark" ? "rgba(10, 10, 20, 1)" : "rgba(20, 20, 40, 1)"
      ctx!.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Update and draw black holes
      blackHoles.forEach((blackHole) => {
        blackHole.update()
        blackHole.draw()
      })

      // Update and draw planets
      planets.forEach((planet) => {
        planet.x += planet.speedX
        planet.y += planet.speedY
        planet.rotation += planet.rotationSpeed

        // Draw planet
        ctx.save()
        ctx.translate(planet.x, planet.y)
        ctx.rotate(planet.rotation)

        // Planet body
        const planetGradient = ctx.createRadialGradient(-planet.size * 0.3, -planet.size * 0.3, 0, 0, 0, planet.size)
        planetGradient.addColorStop(0, planet.color)
        planetGradient.addColorStop(1, planet.color.replace(/[\d.]+\)$/, "0.3)"))

        ctx.fillStyle = planetGradient
        ctx.beginPath()
        ctx.arc(0, 0, planet.size, 0, Math.PI * 2)
        ctx.fill()

        // Planet rings
        if (planet.hasRings && planet.ringColor) {
          ctx.strokeStyle = planet.ringColor
          ctx.lineWidth = 2
          ctx.setLineDash([2, 4])

          for (let i = 1; i <= 3; i++) {
            ctx.beginPath()
            ctx.ellipse(0, 0, planet.size * (1.3 + i * 0.2), planet.size * (0.3 + i * 0.1), 0, 0, Math.PI * 2)
            ctx.stroke()
          }
        }

        ctx.restore()

        // Keep on screen
        if (planet.x < -planet.size) planet.x = window.innerWidth + planet.size
        if (planet.x > window.innerWidth + planet.size) planet.x = -planet.size
        if (planet.y < -planet.size) planet.y = window.innerHeight + planet.size
        if (planet.y > window.innerHeight + planet.size) planet.y = -planet.size
      })

      // Update and draw asteroids
      asteroids.forEach((asteroid) => {
        asteroid.x += asteroid.speedX
        asteroid.y += asteroid.speedY
        asteroid.rotation += asteroid.rotationSpeed

        ctx.save()
        ctx.translate(asteroid.x, asteroid.y)
        ctx.rotate(asteroid.rotation)

        // Draw irregular asteroid shape
        ctx.fillStyle = theme === "dark" ? "rgba(150, 150, 150, 0.8)" : "rgba(100, 100, 100, 0.6)"
        ctx.beginPath()

        const points = 6
        for (let i = 0; i < points; i++) {
          const angle = (i * Math.PI * 2) / points
          const radius = asteroid.size * (0.7 + Math.random() * 0.6)
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)

          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()

        // Keep on screen
        if (asteroid.x < -asteroid.size) asteroid.x = window.innerWidth + asteroid.size
        if (asteroid.x > window.innerWidth + asteroid.size) asteroid.x = -asteroid.size
        if (asteroid.y < -asteroid.size) asteroid.y = window.innerHeight + asteroid.size
        if (asteroid.y > window.innerHeight + asteroid.size) asteroid.y = -asteroid.size
      })

      // Update and draw stars
      stars.forEach((star) => {
        star.update()
        star.draw()
      })

      requestAnimationFrame(renderScene)
    }

    initScene()
    renderScene()

    window.addEventListener("resize", initScene)
    return () => window.removeEventListener("resize", initScene)
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
