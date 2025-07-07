"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Shorter preloader time for better performance
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 bg-gray-950 dark:bg-gray-950 flex justify-center items-center z-[9999]",
        "transition-opacity duration-300",
        !isLoading && "opacity-0 invisible",
      )}
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-green-200/20 border-t-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-blue-200/20 border-t-blue-500 rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  )
}

export default Preloader
