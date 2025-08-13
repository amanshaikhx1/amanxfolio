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
          <div className="group cursor-pointer flex items-center space-x-3" onClick={closeMobileMenu}>
            {/* Compact Logo Icon */}
            <div className="relative w-14 h-14 flex-shrink-0"> {/* w-10 h-10 → w-14 h-14 */}
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

              {/* Main logo container */}
              <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-black rounded-xl border border-slate-600/50 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 animate-pulse"></div>
                {/* Geometric elements */}
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                {/* Central letter A */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    A
                  </span>
                </div>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/60 rounded-tl-lg opacity-40"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/60 rounded-br-lg opacity-40"></div>
              </div>
            </div>
            {/* Compact Text */}
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  AmanxFolio
                </h1>
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>

              <div className="flex items-center space-x-1.5">
                <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
                <span className="text-xs font-medium text-slate-400 group-hover:text-cyan-300 transition-colors duration-300">
                  Business Data Analyst
                </span>
              </div>
            </div>
          </div>



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
                  <div className="group cursor-pointer flex items-center space-x-3" onClick={closeMobileMenu}>
                    {/* Compact Logo Icon */}
                    <div className="relative w-14 h-14 flex-shrink-0"> {/* w-10 h-10 → w-14 h-14 */}
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

                      {/* Main logo container */}
                      <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-black rounded-xl border border-slate-600/50 overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 animate-pulse"></div>
                        {/* Geometric elements */}
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        {/* Central letter A */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                            A
                          </span>
                        </div>
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/60 rounded-tl-lg opacity-40"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/60 rounded-br-lg opacity-40"></div>
                      </div>
                    </div>
                    {/* Compact Text */}
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-purple-400 transition-all duration-300">
                          AmanxFolio
                        </h1>
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
                        <span className="text-xs font-medium text-slate-400 group-hover:text-cyan-300 transition-colors duration-300">
                          Business Data Analyst
                        </span>
                      </div>
                    </div>
                  </div>
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