"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

const SCROLL_THRESHOLD = 300
const DEBOUNCE_DELAY = 100

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Debounce helper
  const debounce = (func: () => void, delay: number) => {
    let timeout: NodeJS.Timeout
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(func, delay)
    }
  }

  const checkScrollPosition = useCallback(() => {
    setIsVisible(window.scrollY > SCROLL_THRESHOLD)
  }, [])

  useEffect(() => {
    const handleScroll = debounce(checkScrollPosition, DEBOUNCE_DELAY)
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Check initial position
    checkScrollPosition()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [checkScrollPosition])

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed right-5 bottom-5 w-11 h-11 md:w-12 md:h-12 rounded-full z-50",
        "bg-gradient-to-r from-green-500 to-green-400 text-white",
        "flex items-center justify-center transition-all duration-300 ease-in-out",
        "shadow-lg hover:shadow-green-500/50 hover:-translate-y-1",
        isVisible
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  )
}

export default BackToTop
