"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sections, setSections] = useState<Element[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    setSections(Array.from(document.querySelectorAll("section")))
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleScrollOptimized = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScrollOptimized, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScrollOptimized)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (entry.target.id !== activeSection) {
              setActiveSection(entry.target.id)
            }
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: "-80px 0px 0px 0px",
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [sections, activeSection])

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen)
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const navLinks = [
    { href: "#home", label: "Home", type: "scroll" },
    { href: "#about", label: "About", type: "scroll" },
    { href: "#skills", label: "Skills", type: "scroll" },
    { href: "#resume", label: "Resume", type: "scroll" },
    { href: "#portfolio", label: "Projects", type: "scroll" },
    { href: "/blog", label: "Blog", type: "navigate" }, // Changed to navigate to blog page
    { href: "#contact", label: "Contact", type: "scroll" },
  ] as const

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    e.preventDefault()
    closeMobileMenu()

    if (link.type === "navigate") {
      // Navigate to blog page
      router.push(link.href)
    } else {
      // Check if we're on a blog page
      if (pathname.startsWith("/blog")) {
        // If on blog page, navigate to home page with hash
        router.push(`/${link.href}`)
      } else {
        // If on home page, smooth scroll to section
        const targetId = link.href.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
        }
      }
    }
  }

  const isActiveLink = (link: (typeof navLinks)[0]) => {
    if (link.type === "navigate") {
      return pathname === link.href || pathname.startsWith(link.href)
    }
    // Only show active state for scroll links when on home page
    if (pathname === "/") {
      return activeSection === link.href.substring(1)
    }
    return false
  }

  return (
    <header
      className={cn(
        "sticky top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b",
        "bg-black/90 border-white/10",
        isScrolled && "py-1 shadow-md",
      )}
    >
      <div className="container mx-auto px-5">
        <nav className={cn("flex items-center justify-between py-5 transition-all", isScrolled && "py-3")}>
          <Link href="/" className="text-2xl font-bold flex items-center z-10 text-white" onClick={closeMobileMenu}>
            <div className="relative w-12 h-12 mr-3 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg rotate-45 animate-pulse-slow"></div>
              <div className="absolute inset-1 bg-black rounded-lg rotate-45"></div>
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <span className="text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text font-bold text-2xl animate-pulse-slow">
                  A
                </span>
              </div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow animation-delay-1000"></div>
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold leading-none">
                AmanxFolio
              </span>
              <span className="text-xs text-gray-400">Business Data Analyst</span>
            </div>
          </Link>

          <ul
            className={cn(
              "fixed md:relative top-[80px] md:top-0 left-0 md:left-auto w-full md:w-auto h-[100vh] md:h-auto",
              "md:flex items-center gap-7 transition-transform duration-300 ease-in-out z-40",
              "bg-gray-900 bg-opacity-100 md:bg-transparent", "border-t md:border-t-0 border-white/10 pt-8 md:pt-0",
              isMobileMenuOpen
                ? "translate-x-0 opacity-100 visible"
                : "-translate-x-full md:translate-x-0 opacity-0 md:opacity-100 invisible md:visible",
            )}
          >
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="mx-0 md:mx-0 my-4 md:my-0 text-center md:text-left w-4/5 md:w-auto mx-auto"
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-base md:text-sm font-medium relative py-2 px-4 md:px-0 block md:inline-block rounded-md md:rounded-none transition-all",
                    "text-white hover:text-green-500 hover:translate-x-1 md:hover:translate-x-0",
                    "after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5",
                    "after:bg-gradient-to-r after:from-green-500 after:to-green-400 after:rounded-sm after:transition-all",
                    "hover:after:w-full",
                    isActiveLink(link) && "text-green-500 after:w-full dark:bg-green-500/10 md:dark:bg-transparent",
                  )}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-800 dark:bg-gray-800 hover:bg-gray-700 text-white"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-5 h-5 bg-gray-500 rounded-full animate-pulse" />
              ) : theme === "dark" ? (
                <Moon className="h-5 w-5 text-yellow-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </Button>

            <button
              className="md:hidden flex flex-col justify-center items-center text-white"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <div className="space-y-1.5">
                  <span className="block w-6 h-0.5 bg-white"></span>
                  <span className="block w-6 h-0.5 bg-white"></span>
                  <span className="block w-6 h-0.5 bg-white"></span>
                </div>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
