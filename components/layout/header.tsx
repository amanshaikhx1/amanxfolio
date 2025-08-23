"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Ensure sections are queried after the DOM is fully rendered
    const sectionElements = Array.from(document.querySelectorAll("section[id]"));
    if (sectionElements.length === 0) {
      console.warn("No sections with IDs found in the DOM");
    } else {
      console.log("Found sections:", sectionElements.map((s) => s.id));
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleScrollOptimized = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScrollOptimized, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollOptimized);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) {
      console.warn("No sections with IDs found for IntersectionObserver");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newSection = entry.target.id;
            if (newSection !== activeSection) {
              console.log(`Active section changed to: ${newSection}`);
              setActiveSection(newSection);
            }
          }
        });
      },
      {
        threshold: [0.3, 0.5, 0.7], // Multiple thresholds for better detection
        rootMargin: "-80px 0px -20% 0px", // Adjusted for header and smoother transitions
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    // Set initial active section on load
    const initialSection = Array.from(sections).find(
      (section) =>
        window.scrollY >= section.offsetTop - 80 &&
        window.scrollY < section.offsetTop + section.offsetHeight - 80
    );
    if (initialSection) {
      setActiveSection(initialSection.id);
    }

    return () => observer.disconnect();
  }, [activeSection]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const navLinks = [
    { href: "#home", label: "HOME", type: "scroll" },
    { href: "#about", label: "ABOUT", type: "scroll" },
    { href: "#skills", label: "SKILLS", type: "scroll" },
    { href: "#resume", label: "RESUME", type: "scroll" },
    { href: "#projects", label: "PROJECTS", type: "scroll" },
    { href: "/blog", label: "BLOG", type: "navigate" },
    { href: "#contact", label: "CONTACT", type: "scroll" },
  ] as const;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    e.preventDefault();
    closeMobileMenu();

    if (link.type === "navigate") {
      router.push(link.href);
    } else {
      if (pathname.startsWith("/blog")) {
        router.push(`/${link.href}`);
      } else {
        const targetId = link.href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        } else {
          console.warn(`Element with id ${targetId} not found`);
        }
      }
    }
  };

  const isActiveLink = (link: (typeof navLinks)[0]) => {
    if (link.type === "navigate") {
      return pathname === link.href || pathname.startsWith(link.href);
    }
    if (pathname === "/") {
      return activeSection === link.href.substring(1);
    }
    return false;
  };

  return (
    <header
      className={cn(
        "sticky top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b",
        "bg-black/90 border-white/10",
        isScrolled && "py-1 shadow-md"
      )}
    >
      <div className="container mx-auto px-5">
        <nav className={cn("flex items-center justify-between py-5 transition-all", isScrolled && "py-3")}>
          <div className="group cursor-pointer flex items-center space-x-3" onClick={closeMobileMenu}>
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-black rounded-xl border border-slate-600/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 animate-pulse"></div>
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    A
                  </span>
                </div>
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/60 rounded-tl-lg opacity-40"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/60 rounded-br-lg opacity-40"></div>
              </div>
            </div>
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

          <div className="hidden md:flex items-center absolute left-[55%] transform -translate-x-1/2">
            <div
              className="flex items-center space-x-2 rounded-full px-6 py-3 border border-border/30"
              style={{ backgroundColor: "hsl(217.2deg 34.22% 8%)" }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-bold tracking-wider transition-all duration-500 px-6 py-3 rounded-full",
                    "text-white hover:text-white hover:scale-110 transform-gpu",
                    "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2",
                    "after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-400 after:to-green-500 after:rounded-full",
                    "after:transition-all after:duration-300 after:ease-out",
                    "hover:after:w-4/5 group overflow-hidden",
                    "focus:ring-0",
                    isActiveLink(link) && "text-white after:w-4/5"
                  )}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  <span className="relative z-10 font-semibold">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black md:hidden">
              <div className="flex flex-col h-full bg-black">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black">
                  <div className="group cursor-pointer flex items-center space-x-3" onClick={closeMobileMenu}>
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-black rounded-xl border border-slate-600/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 animate-pulse"></div>
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                            A
                          </span>
                        </div>
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/60 rounded-tl-lg opacity-40"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/60 rounded-br-lg opacity-40"></div>
                      </div>
                    </div>
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
                <nav className="flex flex-col px-8 pt-8 space-y-6 bg-black">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-white text-xl font-normal tracking-wide transition-colors duration-200 uppercase",
                        "hover:text-green-500 pb-2 border-b border-gray-600",
                        isActiveLink(link) && "text-green-500"
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
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : "-translate-y-1"
                )}
              ></div>
              <div
                className={cn(
                  "w-6 h-1 bg-white rounded-full transition-all duration-300 transform-gpu",
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                )}
              ></div>
              <div
                className={cn(
                  "w-6 h-1 bg-white rounded-full transition-all duration-300 transform-gpu",
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : "translate-y-1"
                )}
              ></div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;