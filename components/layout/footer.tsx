"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

const Footer = () => {
  // Memoize current year to avoid unnecessary re-renders
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center">
      <div className="container mx-auto px-5">
        <p className="text-gray-600 dark:text-gray-400">
          <Link href="#" className="text-green-500 hover:text-green-600 transition-colors font-medium" prefetch>
            Aman Shaikh
          </Link>{" "}
          &copy; {currentYear} made with{" "}
          <Heart 
            className="inline-block h-4 w-4 text-red-500 transition-transform duration-300 ease-in-out hover:scale-110" 
            fill="currentColor" 
          />{" "}
        </p>
      </div>
    </footer>
  )
}

export default Footer
