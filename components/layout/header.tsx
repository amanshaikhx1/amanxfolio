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
    { href: "#home", label: "HOME", type: "scroll" },
    { href: "#about", label: "ABOUT", type: "scroll" },
    { href: "#skills", label: "SKILLS", type: "scroll" },
    { href: "#resume", label: "RESUME", type: "scroll" },
    { href: "#projects", label: "PROJECTS", type: "scroll" },
    { href: "/blog", label: "BLOG", type: "navigate" },
    { href: "#contact", label: "CONTACT", type: "scroll" },
  ] as const

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    e.preventDefault()
    closeMobileMenu()

    if (link.type === "navigate") {
      router.push(link.href)
    } else {
      if (pathname.startsWith("/blog")) {
        router.push(`/${link.href}`)
      } else {
        const targetId = link.href.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
        } else {
          console.log(`Element with id ${targetId} not found`);
        }
      }
    }
  }

  const isActiveLink = (link: (typeof navLinks)[0]) => {
    if (link.type === "navigate") {
      return pathname === link.href || pathname.startsWith(link.href)
    }
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
          <Link href="/" className="text-2xl font-bold flex items-center z-60 text-white hover:text-green-500 transition-colors" onClick={closeMobileMenu}>
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

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium relative py-2 transition-all",
                    "text-white hover:text-green-500",
                    "after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5",
                    "after:bg-gradient-to-r after:from-green-500 after:to-green-400 after:rounded-sm after:transition-all",
                    "hover:after:w-full",
                    isActiveLink(link) && "text-green-500 after:w-full",
                  )}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black md:hidden">
              <div className="flex flex-col h-full bg-black">
                {/* Header in Mobile Menu */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black">
                  <Link href="/" className="text-2xl font-bold flex items-center text-white hover:text-green-500 transition-colors" onClick={closeMobileMenu}>
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
                  <button
                    onClick={closeMobileMenu}
                    className="text-white hover:text-gray-300 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col px-8 pt-8 space-y-6 bg-black">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-white text-xl font-normal tracking-wide transition-colors duration-200 uppercase",
                        "hover:text-green-500 pb-2 border-b border-gray-600",
                        isActiveLink(link) && "text-green-500",
                      )}
                      onClick={(e) => handleNavClick(e, link)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 z-60">
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
              className="md:hidden relative flex flex-col justify-center items-center w-10 h-10 text-white transition-transform duration-300"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <div
                className={cn(
                  "w-6 h-1 bg-white rounded-full transition-all duration-300 transform-gpu",
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : "-translate-y-1",
                )}
              ></div>
              <div
                className={cn(
                  "w-6 h-1 bg-white rounded-full transition-all duration-300 transform-gpu",
                  isMobileMenuOpen ? "opacity-0" : "opacity-100",
                )}
              ></div>
              <div
                className={cn(
                  "w-6 h-1 bg-white rounded-full transition-all duration-300 transform-gpu",
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : "translate-y-1",
                )}
              ></div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header