"use client"

import { useState, useEffect, useRef } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils" // Assuming this utility function is defined for conditional classes.

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string
  loadingClassName?: string
}

const OptimizedImage = ({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg?height=400&width=400", // Placeholder image URL
  loadingClassName,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // This effect sets client-side rendering flag and prevents hydration mismatch
  useEffect(() => {
    setIsClient(true)

    // Set a timeout to force loading state to complete after 3 seconds
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  // Handle image load event
  const handleImageLoad = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    setIsLoading(false)
  }

  // Handle image error event
  const handleImageError = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    setIsLoading(false)
    setError(true)
  }

  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient) {
    return null
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-gray-200 dark:bg-gray-800",
            // Use a simpler animation for better performance
            "animate-pulse",
            loadingClassName
          )}
        />
      )}
      <Image
        ref={imgRef}
        src={error ? fallbackSrc : src}
        alt={alt}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  )
}

export default OptimizedImage
