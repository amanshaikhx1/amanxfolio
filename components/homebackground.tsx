"use client"

import { motion, useReducedMotion } from "framer-motion"

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function HomeBackground() {
  const reduceMotion = useReducedMotion()

  const stars = Array.from({ length: 50 }).map((_, i) => {
    const seed = i + 12345
    return {
      id: i,
      left: `${seededRandom(seed) * 100}%`,
      top: `${seededRandom(seed + 1) * 100}%`,
      size: `${seededRandom(seed + 2) * 2 + 1}px`,
    }
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      
      {/* Static Stars */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white/60"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </div>

      {/* Curved Lines */}
      {typeof window !== "undefined" && window.innerWidth >= 768 && !reduceMotion && (
        <svg
          className="absolute inset-0 w-full h-full z-[2] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            "M 100 100 Q 300 0 500 100 T 900 100",
            "M 0 200 Q 200 100 400 200 T 800 200",
            "M 100 600 Q 300 500 500 600 T 900 600",
          ].map((d, i) => (
            <motion.path
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 0.5,
              }}
              d={d}
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      )}

      {/* Straight Lines */}
      {typeof window !== "undefined" && window.innerWidth >= 768 && !reduceMotion && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "-100%", opacity: [0, 0.7, 0.7, 0] }}
              transition={{
                duration: 2.6,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className={`absolute right-0 ${i === 2 ? "hidden md:block" : ""}`}
              style={{
                top: `${15 + i * 10}%`,
                height: "1px",
                width: "100%",
                background:
                  "linear-gradient(90deg, transparent, #22d3ee60, transparent)",
              }}
            />
          ))}
        </div>
      )}

      {/* Center Glow */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute left-1/2 top-1/2 h-72 w-72 md:h-[28rem] md:w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl"
        />
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent, rgba(0,0,0,0.6))",
        }}
        aria-hidden="true"
      />
    </div>
  )
}
