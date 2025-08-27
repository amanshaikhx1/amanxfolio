"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"

class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
}

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const backgroundCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const seededRandomRef = useRef<SeededRandom>(new SeededRandom(12345))

  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const { theme } = useTheme()

  const performanceConfig = useMemo(
    () => ({
      targetFPS: isLowEndDevice ? 30 : 60,
      frameInterval: isLowEndDevice ? 1000 / 30 : 1000 / 60,
      particleCount: isLowEndDevice ? 15 : 25,
      orbCount: isLowEndDevice ? 2 : 4,
      waveCount: isLowEndDevice ? 1 : 2,
      starCount: isLowEndDevice ? 30 : 60,
      streamCount: isLowEndDevice ? 2 : 4,
      connectionDistance: 100,
      maxConnections: isLowEndDevice ? 2 : 3,
    }),
    [isLowEndDevice],
  )

  useEffect(() => {
    setMounted(true)

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleReducedMotionChange)

    const detectDeviceCapabilities = () => {
      const hardwareConcurrency = (navigator as any).hardwareConcurrency
      const isLowEnd =
        (hardwareConcurrency && hardwareConcurrency <= 4) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.devicePixelRatio && window.devicePixelRatio < 2)
      setIsLowEndDevice(!!isLowEnd)
    }

    detectDeviceCapabilities()

    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange)
    }
  }, [])

  const createBackgroundCanvas = useCallback(() => {
    if (!backgroundCanvasRef.current) {
      backgroundCanvasRef.current = document.createElement("canvas")
      backgroundCtxRef.current = backgroundCanvasRef.current.getContext("2d") as CanvasRenderingContext2D
    }

    const bgCanvas = backgroundCanvasRef.current
    const bgCtx = backgroundCtxRef.current!

    bgCanvas.width = window.innerWidth
    bgCanvas.height = window.innerHeight

    // Create main gradient once
    const mainGradient = bgCtx.createRadialGradient(
      window.innerWidth * 0.5,
      window.innerHeight * 0.5,
      0,
      window.innerWidth * 0.5,
      window.innerHeight * 0.5,
      Math.max(window.innerWidth, window.innerHeight) * 0.7,
    )

    mainGradient.addColorStop(0, "rgba(8, 20, 45, 1)")
    mainGradient.addColorStop(0.3, "rgba(0, 0, 0, 1)")
    mainGradient.addColorStop(0.6, "rgba(0, 15, 8, 0.3)")
    mainGradient.addColorStop(1, "rgba(0, 0, 0, 1)")

    bgCtx.fillStyle = mainGradient
    bgCtx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    // Pre-create accent gradients
    const accents = [
      {
        x: window.innerWidth * 0.3,
        y: window.innerHeight * 0.2,
        radius: 400,
        color: "rgba(0, 120, 255, 0.08)",
      },
      {
        x: window.innerWidth * 0.7,
        y: window.innerHeight * 0.8,
        radius: 350,
        color: "rgba(0, 100, 50, 0.02)",
      },
    ]

    accents.forEach((accent) => {
      const gradient = bgCtx.createRadialGradient(accent.x, accent.y, 0, accent.x, accent.y, accent.radius)
      gradient.addColorStop(0, accent.color)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      bgCtx.fillStyle = gradient
      bgCtx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    })
  }, [])

  useEffect(() => {
    if (!mounted || prefersReducedMotion || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      powerPreference: "high-performance",
    }) as CanvasRenderingContext2D | null
    if (!ctx) return

    ctxRef.current = ctx

    const updateCanvasSize = () => {
      const dpr = isLowEndDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)

      // Set rendering optimizations
      ctx.imageSmoothingEnabled = !isLowEndDevice
      ctx.imageSmoothingQuality = isLowEndDevice ? "low" : "high"

      createBackgroundCanvas()
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
      connectionCount: number
      lastGlowGradient: CanvasGradient | null = null
      lastGlowSize = 0

      constructor() {
        this.x = 0
        this.y = 0
        this.size = 0
        this.opacity = 0
        this.velocityX = 0
        this.velocityY = 0
        this.color = ""
        this.pulsePhase = 0
        this.rotationSpeed = 0
        this.orbitRadius = 0
        this.orbitAngle = 0
        this.baseX = 0
        this.baseY = 0
        this.floatOffset = 0
        this.scalePhase = 0
        this.connectionCount = 0
        this.reset()
      }

      reset() {
        const rng = seededRandomRef.current
        this.x = rng.next() * window.innerWidth
        this.y = rng.next() * window.innerHeight
        this.size = rng.next() * 2 + 1
        this.opacity = rng.next() * 0.4 + 0.2
        this.velocityX = (rng.next() - 0.5) * 1.2
        this.velocityY = (rng.next() - 0.5) * 1.2
        this.pulsePhase = rng.next() * Math.PI * 2

        this.rotationSpeed = (rng.next() - 0.5) * 0.02
        this.orbitRadius = rng.next() * 30 + 10
        this.orbitAngle = rng.next() * Math.PI * 2
        this.baseX = this.x
        this.baseY = this.y
        this.floatOffset = rng.next() * Math.PI * 2
        this.scalePhase = rng.next() * Math.PI * 2

        if (rng.next() < 0.1) {
          this.color = "rgba(0, 120, 80, "
        } else {
          const colors = ["rgba(0, 140, 255, ", "rgba(100, 180, 255, "]
          this.color = colors[Math.floor(rng.next() * colors.length)]
        }
      }

      draw() {
        if (!ctxRef.current) return

        const pulse = Math.sin(this.pulsePhase) * 0.4 + 0.7
        const scalePulse = Math.sin(this.scalePhase) * 0.2 + 0.9
        const currentSize = this.size * pulse * scalePulse

        const glowIntensity = Math.sin(this.pulsePhase * 0.7) * 0.3 + 0.7

        const glowSize = currentSize * 4
        if (!this.lastGlowGradient || Math.abs(this.lastGlowSize - glowSize) > 0.5) {
          this.lastGlowGradient = ctxRef.current.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize)
          this.lastGlowGradient.addColorStop(0, this.color + this.opacity * glowIntensity + ")")
          this.lastGlowGradient.addColorStop(0.3, this.color + this.opacity * 0.5 * glowIntensity + ")")
          this.lastGlowGradient.addColorStop(0.7, this.color + this.opacity * 0.2 * glowIntensity + ")")
          this.lastGlowGradient.addColorStop(1, this.color + "0)")
          this.lastGlowSize = glowSize
        }

        ctxRef.current.fillStyle = this.lastGlowGradient
        ctxRef.current.beginPath()
        ctxRef.current.arc(this.x, this.y, glowSize, 0, Math.PI * 2)
        ctxRef.current.fill()

        const coreOpacity = this.opacity * (Math.sin(this.pulsePhase * 1.3) * 0.3 + 0.8)
        ctxRef.current.fillStyle = this.color + coreOpacity + ")"
        ctxRef.current.beginPath()
        ctxRef.current.arc(this.x, this.y, currentSize, 0, Math.PI * 2)
        ctxRef.current.fill()
      }

      update(deltaTime: number) {
        const timeMultiplier = deltaTime / 16.67 // Normalize to 60fps

        this.baseX += this.velocityX * timeMultiplier
        this.baseY += this.velocityY * timeMultiplier

        this.orbitAngle += this.rotationSpeed * timeMultiplier
        const orbitX = Math.cos(this.orbitAngle) * this.orbitRadius
        const orbitY = Math.sin(this.orbitAngle) * this.orbitRadius

        this.floatOffset += 0.015 * timeMultiplier
        const floatX = Math.sin(this.floatOffset) * 15
        const floatY = Math.cos(this.floatOffset * 0.7) * 10

        this.x = this.baseX + orbitX + floatX
        this.y = this.baseY + orbitY + floatY

        this.pulsePhase += 0.03 * timeMultiplier
        this.scalePhase += 0.025 * timeMultiplier

        if (this.baseX < -50) this.baseX = window.innerWidth + 50
        if (this.baseX > window.innerWidth + 50) this.baseX = -50
        if (this.baseY < -50) this.baseY = window.innerHeight + 50
        if (this.baseY > window.innerHeight + 50) this.baseY = -50
      }

      drawConnections(particles: ElegantParticle[]) {
        if (!ctxRef.current || this.connectionCount >= performanceConfig.maxConnections) return

        let connectionsDrawn = 0
        for (let i = 0; i < particles.length && connectionsDrawn < performanceConfig.maxConnections; i++) {
          const other = particles[i]
          if (other === this || other.connectionCount >= performanceConfig.maxConnections) continue

          const dx = this.x - other.x
          const dy = this.y - other.y
          const distanceSquared = dx * dx + dy * dy
          const maxDistanceSquared = performanceConfig.connectionDistance * performanceConfig.connectionDistance

          if (distanceSquared < maxDistanceSquared) {
            const distance = Math.sqrt(distanceSquared)
            const baseOpacity = (1 - distance / performanceConfig.connectionDistance) * 0.15
            const pulseConnection = Math.sin((this.pulsePhase + other.pulsePhase) * 0.5) * 0.05 + 0.95
            const connectionOpacity = baseOpacity * pulseConnection

            ctxRef.current.strokeStyle = `rgba(0, 120, 200, ${connectionOpacity})`
            ctxRef.current.lineWidth = 0.8
            ctxRef.current.beginPath()
            ctxRef.current.moveTo(this.x, this.y)
            ctxRef.current.lineTo(other.x, other.y)
            ctxRef.current.stroke()

            connectionsDrawn++
            this.connectionCount++
            other.connectionCount++
          }
        }
      }
    }

    class HexagonalGrid {
      opacity: number
      pulsePhase: number
      hexSize: number
      hexHeight: number
      hexWidth: number
      gridPoints: Array<{ x: number; y: number }> = []

      constructor() {
        this.opacity = 0.03
        this.pulsePhase = 0
        this.hexSize = 60
        this.hexHeight = this.hexSize * Math.sqrt(3)
        this.hexWidth = this.hexSize * 2
        this.precomputeGrid()
      }

      precomputeGrid() {
        this.gridPoints = []
        for (let row = 0; row < Math.ceil(window.innerHeight / this.hexHeight) + 1; row++) {
          for (let col = 0; col < Math.ceil(window.innerWidth / (this.hexWidth * 0.75)) + 1; col++) {
            const x = col * this.hexWidth * 0.75
            const y = row * this.hexHeight + (col % 2) * (this.hexHeight / 2)
            this.gridPoints.push({ x, y })
          }
        }
      }

      draw() {
        if (!ctxRef.current) return

        const pulse = Math.sin(this.pulsePhase) * 0.02 + 0.03
        ctxRef.current.strokeStyle = `rgba(0, 150, 255, ${pulse})`
        ctxRef.current.lineWidth = 0.5

        ctxRef.current.beginPath()
        this.gridPoints.forEach((point) => {
          this.addHexagonPath(point.x, point.y, this.hexSize)
        })
        ctxRef.current.stroke()
      }

      addHexagonPath(centerX: number, centerY: number, size: number) {
        if (!ctxRef.current) return

        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const x = centerX + size * Math.cos(angle)
          const y = centerY + size * Math.sin(angle)
          if (i === 0) {
            ctxRef.current.moveTo(x, y)
          } else {
            ctxRef.current.lineTo(x, y)
          }
        }
        ctxRef.current.closePath()
      }

      update(deltaTime: number) {
        this.pulsePhase += 0.01 * (deltaTime / 16.67)
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
        this.x = 0
        this.y = 0
        this.length = 0
        this.angle = 0
        this.speed = 0
        this.opacity = 0
        this.color = ""
        this.segments = []
        this.reset()
      }

      reset() {
        const rng = seededRandomRef.current
        this.x = rng.next() * window.innerWidth
        this.y = rng.next() * window.innerHeight
        this.length = rng.next() * 100 + 50
        this.angle = rng.next() * Math.PI * 2
        this.speed = rng.next() * 2 + 1
        this.opacity = rng.next() * 0.3 + 0.1
        this.color = rng.next() < 0.8 ? "rgba(0, 150, 255, " : "rgba(0, 100, 60, "
        this.segments = []

        for (let i = 0; i < 15; i++) {
          this.segments.push({
            x: this.x,
            y: this.y,
            opacity: 0,
          })
        }
      }

      draw() {
        if (!ctxRef.current) return

        ctxRef.current.beginPath()
        for (let i = 0; i < this.segments.length; i++) {
          const segment = this.segments[i]
          const segmentOpacity = segment.opacity * this.opacity

          if (segmentOpacity > 0.02) {
            ctxRef.current.moveTo(segment.x + 2, segment.y)
            ctxRef.current.arc(segment.x, segment.y, 2, 0, Math.PI * 2)
          }
        }
        ctxRef.current.fillStyle = this.color + this.opacity + ")"
        ctxRef.current.fill()
      }

      update(deltaTime: number) {
        const timeMultiplier = deltaTime / 16.67

        this.x += Math.cos(this.angle) * this.speed * timeMultiplier
        this.y += Math.sin(this.angle) * this.speed * timeMultiplier

        for (let i = this.segments.length - 1; i > 0; i--) {
          this.segments[i].x = this.segments[i - 1].x
          this.segments[i].y = this.segments[i - 1].y
          this.segments[i].opacity = this.segments[i - 1].opacity * 0.92
        }

        this.segments[0].x = this.x
        this.segments[0].y = this.y
        this.segments[0].opacity = 1

        if (this.x < -100 || this.x > window.innerWidth + 100 || this.y < -100 || this.y > window.innerHeight + 100) {
          this.reset()
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
      cachedGradient: CanvasGradient | null = null
      lastSize = 0

      constructor() {
        this.x = 0
        this.y = 0
        this.size = 0
        this.opacity = 0
        this.velocityX = 0
        this.velocityY = 0
        this.pulsePhase = 0
        this.color = ""
        this.rotationAngle = 0
        this.reset()
      }

      reset() {
        const rng = seededRandomRef.current
        this.x = rng.next() * window.innerWidth
        this.y = rng.next() * window.innerHeight
        this.size = rng.next() * 8 + 4
        this.opacity = rng.next() * 0.2 + 0.1
        this.velocityX = (rng.next() - 0.5) * 0.5
        this.velocityY = (rng.next() - 0.5) * 0.5
        this.pulsePhase = rng.next() * Math.PI * 2
        this.rotationAngle = rng.next() * Math.PI * 2

        const orbColors = ["rgba(0, 120, 255, ", "rgba(0, 80, 40, ", "rgba(20, 140, 255, "]
        this.color = orbColors[Math.floor(rng.next() * orbColors.length)]
      }

      draw() {
        if (!ctxRef.current) return

        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7
        const currentSize = this.size * pulse

        if (!this.cachedGradient || Math.abs(this.lastSize - currentSize) > 0.5) {
          this.cachedGradient = ctxRef.current.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentSize * 3)
          this.cachedGradient.addColorStop(0, this.color + this.opacity * 0.8 + ")")
          this.cachedGradient.addColorStop(0.5, this.color + this.opacity * 0.3 + ")")
          this.cachedGradient.addColorStop(1, this.color + "0)")
          this.lastSize = currentSize
        }

        ctxRef.current.fillStyle = this.cachedGradient
        ctxRef.current.beginPath()
        ctxRef.current.arc(this.x, this.y, currentSize * 3, 0, Math.PI * 2)
        ctxRef.current.fill()

        ctxRef.current.fillStyle = this.color + this.opacity * 0.6 + ")"
        ctxRef.current.beginPath()
        ctxRef.current.arc(this.x, this.y, currentSize * 0.3, 0, Math.PI * 2)
        ctxRef.current.fill()
      }

      update(deltaTime: number) {
        const timeMultiplier = deltaTime / 16.67

        this.x += this.velocityX * timeMultiplier
        this.y += this.velocityY * timeMultiplier
        this.pulsePhase += 0.02 * timeMultiplier
        this.rotationAngle += 0.01 * timeMultiplier

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
        this.x = 0
        this.y = 0
        this.radius = 0
        this.maxRadius = 0
        this.opacity = 0
        this.speed = 0
        this.color = ""
        this.reset()
      }

      reset() {
        const rng = seededRandomRef.current
        this.x = rng.next() * window.innerWidth
        this.y = rng.next() * window.innerHeight
        this.radius = 0
        this.maxRadius = rng.next() * 200 + 100
        this.opacity = rng.next() * 0.1 + 0.05
        this.speed = rng.next() * 0.5 + 0.3

        const waveColors = ["rgba(0, 120, 255, ", "rgba(0, 80, 40, "]
        this.color = waveColors[Math.floor(rng.next() * waveColors.length)]
      }

      draw() {
        if (!ctxRef.current || this.radius > this.maxRadius) return

        const fadeOpacity = this.opacity * (1 - this.radius / this.maxRadius)

        ctxRef.current.strokeStyle = this.color + fadeOpacity + ")"
        ctxRef.current.lineWidth = 1
        ctxRef.current.beginPath()
        ctxRef.current.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctxRef.current.stroke()
      }

      update(deltaTime: number) {
        this.radius += this.speed * (deltaTime / 16.67)

        if (this.radius > this.maxRadius) {
          this.reset()
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
      cachedGradient: CanvasGradient | null = null

      constructor() {
        this.x = 0
        this.y = 0
        this.size = 0
        this.opacity = 0
        this.twinklePhase = 0
        this.twinkleSpeed = 0
        this.velocityX = 0
        this.velocityY = 0
        this.maxOpacity = 0
        this.reset()
      }

      reset() {
        const rng = seededRandomRef.current
        this.x = rng.next() * window.innerWidth
        this.y = rng.next() * window.innerHeight
        this.size = rng.next() * 1.5 + 0.5
        this.maxOpacity = rng.next() * 0.8 + 0.3
        this.opacity = this.maxOpacity
        this.twinklePhase = rng.next() * Math.PI * 2
        this.twinkleSpeed = rng.next() * 0.02 + 0.01
        this.velocityX = (rng.next() - 0.5) * 0.3
        this.velocityY = (rng.next() - 0.5) * 0.3
      }

      draw() {
        if (!ctxRef.current) return

        const twinkle = Math.sin(this.twinklePhase) * 0.4 + 0.6
        const currentOpacity = this.maxOpacity * twinkle

        if (!this.cachedGradient) {
          this.cachedGradient = ctxRef.current.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
          this.cachedGradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`)
          this.cachedGradient.addColorStop(0.5, `rgba(255, 255, 255, ${currentOpacity * 0.3})`)
          this.cachedGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        }

        ctxRef.current.fillStyle = this.cachedGradient
        ctxRef.current.beginPath()
        ctxRef.current.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
        ctxRef.current.fill()

        ctxRef.current.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
        ctxRef.current.beginPath()
        ctxRef.current.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctxRef.current.fill()

        if (twinkle > 0.8) {
          ctxRef.current.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.6})`
          ctxRef.current.lineWidth = 0.5
          ctxRef.current.beginPath()
          ctxRef.current.moveTo(this.x - this.size * 2, this.y)
          ctxRef.current.lineTo(this.x + this.size * 2, this.y)
          ctxRef.current.moveTo(this.x, this.y - this.size * 2)
          ctxRef.current.lineTo(this.x, this.y + this.size * 2)
          ctxRef.current.stroke()
        }
      }

      update(deltaTime: number) {
        const timeMultiplier = deltaTime / 16.67

        this.x += this.velocityX * timeMultiplier
        this.y += this.velocityY * timeMultiplier
        this.twinklePhase += this.twinkleSpeed * timeMultiplier

        if (this.x < -10) this.x = window.innerWidth + 10
        if (this.x > window.innerWidth + 10) this.x = -10
        if (this.y < -10) this.y = window.innerHeight + 10
        if (this.y > window.innerHeight + 10) this.y = -10
      }
    }

    seededRandomRef.current = new SeededRandom(12345)

    const particles: ElegantParticle[] = []
    const floatingOrbs: FloatingOrb[] = []
    const energyWaves: EnergyWave[] = []
    const stars: StarDot[] = []
    const hexGrid = new HexagonalGrid()
    const lightStreams: LightStream[] = []

    for (let i = 0; i < performanceConfig.particleCount; i++) {
      particles.push(new ElegantParticle())
    }

    for (let i = 0; i < performanceConfig.orbCount; i++) {
      floatingOrbs.push(new FloatingOrb())
    }

    for (let i = 0; i < performanceConfig.waveCount; i++) {
      energyWaves.push(new EnergyWave())
    }

    for (let i = 0; i < performanceConfig.starCount; i++) {
      stars.push(new StarDot())
    }

    for (let i = 0; i < performanceConfig.streamCount; i++) {
      lightStreams.push(new LightStream())
    }

    const initScene = () => {
      updateCanvasSize()
      hexGrid.precomputeGrid()
    }

    const renderScene = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current

      if (deltaTime < performanceConfig.frameInterval) {
        animationFrameRef.current = requestAnimationFrame(renderScene)
        return
      }

      lastFrameTimeRef.current = currentTime

      // Clear and draw background from cached canvas
      if (backgroundCanvasRef.current) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        ctx.drawImage(backgroundCanvasRef.current, 0, 0)
      }

      // Reset connection counts
      particles.forEach((p) => (p.connectionCount = 0))

      // Update and draw all elements with delta time
      hexGrid.update(deltaTime)
      hexGrid.draw()

      lightStreams.forEach((stream) => {
        stream.update(deltaTime)
        stream.draw()
      })

      energyWaves.forEach((wave) => {
        wave.update(deltaTime)
        wave.draw()
      })

      floatingOrbs.forEach((orb) => {
        orb.update(deltaTime)
        orb.draw()
      })

      stars.forEach((star) => {
        star.update(deltaTime)
        star.draw()
      })

      particles.forEach((particle) => {
        particle.drawConnections(particles)
      })

      particles.forEach((particle) => {
        particle.update(deltaTime)
        particle.draw()
      })

      animationFrameRef.current = requestAnimationFrame(renderScene)
    }

    initScene()
    animationFrameRef.current = requestAnimationFrame(renderScene)

    const handleResize = () => {
      initScene()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted, prefersReducedMotion, isLowEndDevice, performanceConfig, createBackgroundCanvas])

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
