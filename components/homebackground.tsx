"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

const PremiumBackground = () => {
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
      const mainGradient = ctx!.createRadialGradient(
        window.innerWidth * 0.5,
        window.innerHeight * 0.5,
        0,
        window.innerWidth * 0.5,
        window.innerHeight * 0.5,
        Math.max(window.innerWidth, window.innerHeight) * 0.7,
      )

      mainGradient.addColorStop(0, "rgba(8, 20, 45, 1)") // Deep blue center
      mainGradient.addColorStop(0.3, "rgba(0, 0, 0, 1)") // Pure black
      mainGradient.addColorStop(0.6, "rgba(0, 15, 8, 0.3)") // Much less green
      mainGradient.addColorStop(1, "rgba(0, 0, 0, 1)") // Pure black edges

      ctx!.fillStyle = mainGradient
      ctx!.fillRect(0, 0, window.innerWidth, window.innerHeight)

      const accents = [
        {
          x: window.innerWidth * 0.3,
          y: window.innerHeight * 0.2,
          radius: 400,
          color: "rgba(0, 120, 255, 0.08)", // Enhanced blue
        },
        {
          x: window.innerWidth * 0.7,
          y: window.innerHeight * 0.8,
          radius: 350,
          color: "rgba(0, 100, 50, 0.02)", // Much less green
        },
      ]

      accents.forEach((accent) => {
        const gradient = ctx!.createRadialGradient(accent.x, accent.y, 0, accent.x, accent.y, accent.radius)
        gradient.addColorStop(0, accent.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx!.fillStyle = gradient
        ctx!.fillRect(0, 0, window.innerWidth, window.innerHeight)
      })
    }

    class ElegantParticle {
      x: number
      y: number
      size: number
      opacity: number
      velocityX: number
      velocityY: number
      color: string
      pulsePhase: number
      rotationSpeed: number
      orbitRadius: number
      orbitAngle: number
      baseX: number
      baseY: number
      floatOffset: number
      scalePhase: number

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.4 + 0.2
        this.velocityX = (Math.random() - 0.5) * 1.2
        this.velocityY = (Math.random() - 0.5) * 1.2
        this.pulsePhase = Math.random() * Math.PI * 2

        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.orbitRadius = Math.random() * 30 + 10
        this.orbitAngle = Math.random() * Math.PI * 2
        this.baseX = this.x
        this.baseY = this.y
        this.floatOffset = Math.random() * Math.PI * 2
        this.scalePhase = Math.random() * Math.PI * 2

        if (Math.random() < 0.1) {
          this.color = "rgba(0, 120, 80, "
        } else {
          const colors = [
            "rgba(0, 140, 255, ", // Enhanced blue
            "rgba(100, 180, 255, ", // Light blue
          ]
          this.color = colors[Math.floor(Math.random() * colors.length)]
        }
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.4 + 0.7
        const scalePulse = Math.sin(this.scalePhase) * 0.2 + 0.9
        const currentSize = this.size * pulse * scalePulse

        const glowIntensity = Math.sin(this.pulsePhase * 0.7) * 0.3 + 0.7
        const glowGradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize * 4)
        glowGradient.addColorStop(0, this.color + this.opacity * glowIntensity + ")")
        glowGradient.addColorStop(0.3, this.color + this.opacity * 0.5 * glowIntensity + ")")
        glowGradient.addColorStop(0.7, this.color + this.opacity * 0.2 * glowIntensity + ")")
        glowGradient.addColorStop(1, this.color + "0)")

        ctx!.fillStyle = glowGradient
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, currentSize * 4, 0, Math.PI * 2)
        ctx!.fill()

        const coreOpacity = this.opacity * (Math.sin(this.pulsePhase * 1.3) * 0.3 + 0.8)
        ctx!.fillStyle = this.color + coreOpacity + ")"
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, currentSize, 0, Math.PI * 2)
        ctx!.fill()
      }

      update() {
        this.baseX += this.velocityX
        this.baseY += this.velocityY

        this.orbitAngle += this.rotationSpeed
        const orbitX = Math.cos(this.orbitAngle) * this.orbitRadius
        const orbitY = Math.sin(this.orbitAngle) * this.orbitRadius

        this.floatOffset += 0.015
        const floatX = Math.sin(this.floatOffset) * 15
        const floatY = Math.cos(this.floatOffset * 0.7) * 10

        this.x = this.baseX + orbitX + floatX
        this.y = this.baseY + orbitY + floatY

        this.pulsePhase += 0.03
        this.scalePhase += 0.025

        if (this.baseX < -50) this.baseX = window.innerWidth + 50
        if (this.baseX > window.innerWidth + 50) this.baseX = -50
        if (this.baseY < -50) this.baseY = window.innerHeight + 50
        if (this.baseY > window.innerHeight + 50) this.baseY = -50
      }

      drawConnections(particles: ElegantParticle[]) {
        particles.forEach((other) => {
          if (other === this) return

          const dx = this.x - other.x
          const dy = this.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const baseOpacity = (1 - distance / 120) * 0.15
            const pulseConnection = Math.sin((this.pulsePhase + other.pulsePhase) * 0.5) * 0.05 + 0.95
            const connectionOpacity = baseOpacity * pulseConnection

            ctx!.strokeStyle = `rgba(0, 120, 200, ${connectionOpacity})`
            ctx!.lineWidth = 0.8
            ctx!.beginPath()
            ctx!.moveTo(this.x, this.y)
            ctx!.lineTo(other.x, other.y)
            ctx!.stroke()
          }
        })
      }
    }

    class HexagonalGrid {
      opacity: number
      pulsePhase: number

      constructor() {
        this.opacity = 0.03
        this.pulsePhase = 0
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.02 + 0.03
        ctx!.strokeStyle = `rgba(0, 150, 255, ${pulse})`
        ctx!.lineWidth = 0.5

        const hexSize = 60
        const hexHeight = hexSize * Math.sqrt(3)
        const hexWidth = hexSize * 2

        for (let row = 0; row < Math.ceil(window.innerHeight / hexHeight) + 1; row++) {
          for (let col = 0; col < Math.ceil(window.innerWidth / (hexWidth * 0.75)) + 1; col++) {
            const x = col * hexWidth * 0.75
            const y = row * hexHeight + (col % 2) * (hexHeight / 2)

            this.drawHexagon(x, y, hexSize)
          }
        }
      }

      drawHexagon(centerX: number, centerY: number, size: number) {
        ctx!.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const x = centerX + size * Math.cos(angle)
          const y = centerY + size * Math.sin(angle)
          if (i === 0) {
            ctx!.moveTo(x, y)
          } else {
            ctx!.lineTo(x, y)
          }
        }
        ctx!.closePath()
        ctx!.stroke()
      }

      update() {
        this.pulsePhase += 0.01
      }
    }

    class LightStream {
      x: number
      y: number
      length: number
      angle: number
      speed: number
      opacity: number
      color: string
      segments: Array<{ x: number; y: number; opacity: number }>

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.length = Math.random() * 100 + 50
        this.angle = Math.random() * Math.PI * 2
        this.speed = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.3 + 0.1
        this.color = Math.random() < 0.8 ? "rgba(0, 150, 255, " : "rgba(0, 100, 60, "
        this.segments = []

        for (let i = 0; i < 20; i++) {
          this.segments.push({
            x: this.x,
            y: this.y,
            opacity: 0,
          })
        }
      }

      draw() {
        for (let i = 0; i < this.segments.length; i++) {
          const segment = this.segments[i]
          const segmentOpacity = segment.opacity * this.opacity

          if (segmentOpacity > 0.01) {
            ctx!.fillStyle = this.color + segmentOpacity + ")"
            ctx!.beginPath()
            ctx!.arc(segment.x, segment.y, 2, 0, Math.PI * 2)
            ctx!.fill()
          }
        }
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Update segments
        for (let i = this.segments.length - 1; i > 0; i--) {
          this.segments[i].x = this.segments[i - 1].x
          this.segments[i].y = this.segments[i - 1].y
          this.segments[i].opacity = this.segments[i - 1].opacity * 0.9
        }

        this.segments[0].x = this.x
        this.segments[0].y = this.y
        this.segments[0].opacity = 1

        if (this.x < -100 || this.x > window.innerWidth + 100 || this.y < -100 || this.y > window.innerHeight + 100) {
          this.x = Math.random() * window.innerWidth
          this.y = Math.random() * window.innerHeight
          this.angle = Math.random() * Math.PI * 2
        }
      }
    }

    class FloatingOrb {
      x: number
      y: number
      size: number
      opacity: number
      velocityX: number
      velocityY: number
      pulsePhase: number
      color: string
      rotationAngle: number

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 8 + 4
        this.opacity = Math.random() * 0.2 + 0.1
        this.velocityX = (Math.random() - 0.5) * 0.5
        this.velocityY = (Math.random() - 0.5) * 0.5
        this.pulsePhase = Math.random() * Math.PI * 2
        this.rotationAngle = Math.random() * Math.PI * 2

        const orbColors = ["rgba(0, 120, 255, ", "rgba(0, 80, 40, ", "rgba(20, 140, 255, "]
        this.color = orbColors[Math.floor(Math.random() * orbColors.length)]
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7
        const currentSize = this.size * pulse

        const outerGlow = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize * 3)
        outerGlow.addColorStop(0, this.color + this.opacity * 0.8 + ")")
        outerGlow.addColorStop(0.5, this.color + this.opacity * 0.3 + ")")
        outerGlow.addColorStop(1, this.color + "0)")

        ctx!.fillStyle = outerGlow
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, currentSize * 3, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.fillStyle = this.color + this.opacity * 0.6 + ")"
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, currentSize * 0.3, 0, Math.PI * 2)
        ctx!.fill()
      }

      update() {
        this.x += this.velocityX
        this.y += this.velocityY
        this.pulsePhase += 0.02
        this.rotationAngle += 0.01

        if (this.x < -50) this.x = window.innerWidth + 50
        if (this.x > window.innerWidth + 50) this.x = -50
        if (this.y < -50) this.y = window.innerHeight + 50
        if (this.y > window.innerHeight + 50) this.y = -50
      }
    }

    class EnergyWave {
      x: number
      y: number
      radius: number
      maxRadius: number
      opacity: number
      speed: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.radius = 0
        this.maxRadius = Math.random() * 200 + 100
        this.opacity = Math.random() * 0.1 + 0.05
        this.speed = Math.random() * 0.5 + 0.3

        const waveColors = ["rgba(0, 120, 255, ", "rgba(0, 80, 40, "]
        this.color = waveColors[Math.floor(Math.random() * waveColors.length)]
      }

      draw() {
        if (this.radius > this.maxRadius) return

        const fadeOpacity = this.opacity * (1 - this.radius / this.maxRadius)

        ctx!.strokeStyle = this.color + fadeOpacity + ")"
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx!.stroke()
      }

      update() {
        this.radius += this.speed

        if (this.radius > this.maxRadius) {
          this.radius = 0
          this.x = Math.random() * window.innerWidth
          this.y = Math.random() * window.innerHeight
        }
      }
    }

    class StarDot {
      x: number
      y: number
      size: number
      opacity: number
      twinklePhase: number
      twinkleSpeed: number
      velocityX: number
      velocityY: number
      maxOpacity: number

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 1.5 + 0.5
        this.maxOpacity = Math.random() * 0.8 + 0.3
        this.opacity = this.maxOpacity
        this.twinklePhase = Math.random() * Math.PI * 2
        this.twinkleSpeed = Math.random() * 0.02 + 0.01
        this.velocityX = (Math.random() - 0.5) * 0.3
        this.velocityY = (Math.random() - 0.5) * 0.3
      }

      draw() {
        const twinkle = Math.sin(this.twinklePhase) * 0.4 + 0.6
        const currentOpacity = this.maxOpacity * twinkle

        const starGlow = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
        starGlow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`)
        starGlow.addColorStop(0.5, `rgba(255, 255, 255, ${currentOpacity * 0.3})`)
        starGlow.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx!.fillStyle = starGlow
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()

        if (twinkle > 0.8) {
          ctx!.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.6})`
          ctx!.lineWidth = 0.5
          ctx!.beginPath()
          ctx!.moveTo(this.x - this.size * 2, this.y)
          ctx!.lineTo(this.x + this.size * 2, this.y)
          ctx!.moveTo(this.x, this.y - this.size * 2)
          ctx!.lineTo(this.x, this.y + this.size * 2)
          ctx!.stroke()
        }
      }

      update() {
        this.x += this.velocityX
        this.y += this.velocityY
        this.twinklePhase += this.twinkleSpeed

        if (this.x < -10) this.x = window.innerWidth + 10
        if (this.x > window.innerWidth + 10) this.x = -10
        if (this.y < -10) this.y = window.innerHeight + 10
        if (this.y > window.innerHeight + 10) this.y = -10
      }
    }

    const particles: ElegantParticle[] = []
    const floatingOrbs: FloatingOrb[] = []
    const energyWaves: EnergyWave[] = []
    const stars: StarDot[] = []
    const hexGrid = new HexagonalGrid()
    const lightStreams: LightStream[] = []

    const particleCount = isLowEndDevice ? 20 : 35
    const orbCount = isLowEndDevice ? 3 : 6
    const waveCount = isLowEndDevice ? 2 : 4
    const starCount = isLowEndDevice ? 40 : 80
    const streamCount = isLowEndDevice ? 3 : 6

    for (let i = 0; i < particleCount; i++) {
      particles.push(new ElegantParticle())
    }

    for (let i = 0; i < orbCount; i++) {
      floatingOrbs.push(new FloatingOrb())
    }

    for (let i = 0; i < waveCount; i++) {
      energyWaves.push(new EnergyWave())
    }

    for (let i = 0; i < starCount; i++) {
      stars.push(new StarDot())
    }

    for (let i = 0; i < streamCount; i++) {
      lightStreams.push(new LightStream())
    }

    const initScene = () => {
      updateCanvasSize()
      initBackground()
    }

    const renderScene = () => {
      initBackground()

      hexGrid.update()
      hexGrid.draw()

      lightStreams.forEach((stream) => {
        stream.update()
        stream.draw()
      })

      energyWaves.forEach((wave) => {
        wave.update()
        wave.draw()
      })

      floatingOrbs.forEach((orb) => {
        orb.update()
        orb.draw()
      })

      stars.forEach((star) => {
        star.update()
        star.draw()
      })

      particles.forEach((particle) => {
        particle.drawConnections(particles)
      })

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
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
          "radial-gradient(ellipse at center, rgba(8, 20, 45, 1) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 15, 8, 0.2) 60%, rgba(0, 0, 0, 1) 100%)",
      }}
    />
  )
}

export default PremiumBackground