"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type { Route } from "next";

interface NavLink {
  href: Route<string> | `/#${string}`;
  label: string;
  type: "scroll" | "navigate";
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const sectionElements = Array.from(document.querySelectorAll("section[id]") as NodeListOf<HTMLElement>);
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
    const sections = document.querySelectorAll("section[id]") as NodeListOf<HTMLElement>;
    if (sections.length === 0) {
      console.warn("No sections with IDs found for IntersectionObserver");
      return;
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newSection = (entry.target as HTMLElement).id;
            if (newSection !== activeSection) {
              console.log(`Active section changed to: ${newSection}`);
              setActiveSection(newSection);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    const timer = setTimeout(() => {
      const initialSection = Array.from(sections).find(
        (section) =>
          window.scrollY >= section.offsetTop - 80 &&
          window.scrollY < section.offsetTop + section.offsetHeight - 80
      );
      if (initialSection) {
        setActiveSection(initialSection.id);
      } else {
        console.log("No initial section found, defaulting to 'home'");
        setActiveSection("home");
      }
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [activeSection]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.clientHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [isScrolled]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const navLinks: readonly NavLink[] = [
    { href: "#home", label: "HOME", type: "scroll" },
    { href: "#about", label: "ABOUT", type: "scroll" },
    { href: "#skills", label: "SKILLS", type: "scroll" },
    { href: "#resume", label: "RESUME", type: "scroll" },
    { href: "#projects", label: "PROJECTS", type: "scroll" },
    { href: "/blog", label: "BLOG", type: "navigate" },
    { href: "#contact", label: "CONTACT", type: "scroll" },
  ] as const;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    e.preventDefault();
    closeMobileMenu();

    if (link.type === "navigate") {
      router.push(link.href);
    } else {
      if (pathname.startsWith("/blog")) {
        router.push(link.href);
      } else {
        const targetId = link.href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
          setActiveSection(targetId);
        } else {
          console.warn(`Element with id ${targetId} not found`);
        }
      }
    }
  };

  const isActiveLink = (link: NavLink) => {
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
      ref={headerRef}
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
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10"></div>
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
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
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-1.5">
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
              {navLinks.map((link: NavLink) => (
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
            <label className="hamburger cursor-pointer md:hidden">
              <input
                type="checkbox"
                checked={isMobileMenuOpen}
                onChange={toggleMobileMenu}
              />
              <svg viewBox="0 0 32 32">
                <path
                  className="line line-top-bottom"
                  d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                />
                <path className="line" d="M7 16 27 16" />
              </svg>
            </label>
          </div>
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed left-0 w-full bg-black overflow-y-auto z-40 md:hidden"
          style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
        >
          <nav className="flex flex-col px-8 pt-8 space-y-6 bg-black">
            {navLinks.map((link: NavLink) => (
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
      )}
      <style jsx global>{`
        .hamburger {
          cursor: pointer;
        }
        .hamburger input {
          display: none;
        }
        .hamburger svg {
          height: 3em;
          transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .line {
          fill: none;
          stroke: white;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3;
          transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
            stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .line-top-bottom {
          stroke-dasharray: 12 63;
        }
        .hamburger input:checked + svg {
          transform: rotate(-45deg);
        }
        .hamburger input:checked + svg .line-top-bottom {
          stroke-dasharray: 20 300;
          stroke-dashoffset: -32.42;
        }
      `}</style>
    </header>
  );
};

export default Header;