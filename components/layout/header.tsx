"use client";

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
  const [drawerSlideOpen, setDrawerSlideOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [headerHeight, setHeaderHeight] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const t = requestAnimationFrame(() => setDrawerSlideOpen(true));
      return () => cancelAnimationFrame(t);
    }
    setDrawerSlideOpen(false);
  }, [isMobileMenuOpen]);

  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    if (sections.length === 0) {
      console.warn("No sections with IDs found in the DOM");
    } else {
      console.log("Found sections:", Array.from(sections).map(s => s.id));
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    if (!sections.length) {
      console.warn("No sections with IDs found for IntersectionObserver");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id !== activeSection) {
              console.log(`Active section changed to: ${id}`);
              setActiveSection(id);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    const timer = setTimeout(() => {
      const initial = Array.from(sections).find(
        (section) =>
          window.scrollY >= section.offsetTop - 80 &&
          window.scrollY < section.offsetTop + section.offsetHeight - 80
      );
      setActiveSection(initial?.id ?? "home");
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [activeSection, pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHash = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return;

      const target = document.getElementById(hash);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
        setActiveSection(hash);
      } else {
        console.warn(`Element with id ${hash} not found`);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateHeight = () => {
      headerRef.current && setHeaderHeight(headerRef.current.clientHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
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
    { href: "#blog", label: "BLOG", type: "scroll" },
    { href: "#contact", label: "CONTACT", type: "scroll" },
  ] as const;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    e.preventDefault();
    closeMobileMenu();

    if (link.type === "navigate") {
      router.push((link.href as Route<string>));
      return;
    }

    const targetId = link.href.substring(1);

    if (pathname !== "/") {
      router.push(`/#${targetId}`);
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(targetId);
    } else {
      window.location.hash = targetId;
    }
  };

  const isActiveLink = (link: NavLink) => {
    if (link.type === "navigate") {
      return pathname === link.href || pathname.startsWith(link.href);
    }
    return pathname === "/" && activeSection === link.href.substring(1);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-2 z-50 w-full lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <nav
          className={cn(
            "w-full max-w-6xl mx-auto flex items-center justify-between gap-4 rounded-full border border-white/10 shadow-xl shadow-black/20 pl-5 pr-4 sm:pl-6 sm:pr-5 overflow-visible",
            "backdrop-blur-xl bg-black/80 py-2.5 transition-all",
            isScrolled && "py-2"
          )}
        >
          <div className="group cursor-pointer flex items-center space-x-3 flex-shrink-0" onClick={closeMobileMenu}>
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
                <h1
                  className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-purple-400 transition-all duration-300"
                  style={{ fontFamily: "'Tapestry', cursive" }}
                >
                  AmanxFolio
                </h1>
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-medium text-slate-400 group-hover:text-cyan-300 transition-colors duration-300">
                  Software Engineer
                </span>
              </div>
            </div>
          </div>

          <div id="centerNav" className="hidden lg:flex items-center justify-center flex-1 min-w-0">
            <div
              className="flex items-center gap-0 rounded-full px-3 py-2 border border-border/30"
              style={{ backgroundColor: "hsl(217.2deg 34.22% 8%)" }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium tracking-tight transition-all duration-500 px-4 py-2 rounded-full",
                    "text-white hover:text-white hover:scale-105 transform-gpu",
                    "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2",
                    "after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-400 after:to-green-500 after:rounded-full",
                    "after:transition-all after:duration-300 after:ease-out",
                    "hover:after:w-4/5 group overflow-hidden",
                    "focus:ring-0",
                    isActiveLink(link) && "text-white after:w-4/5"
                  )}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{ fontFamily: "'Goldman', sans-serif" }}
                >
                  <span className="relative z-10 font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-2">
            <div id="dataTools" className="relative group hidden lg:block">
              <button 
                tabIndex={0}
                className="font-medium"
                style={{ fontFamily: "'Goldman', sans-serif" }}
              >
                Data Tools
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-[100] pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                <Link
                  href={"/data-tools" as Route<"/data-tools">}
                  className="block px-4 py-3 text-white hover:bg-gray-800 rounded-t-lg transition-colors duration-150"
                  style={{ fontFamily: "'Goldman', sans-serif" }}
                >
                  Auto Dashboard
                </Link>
              </div>
            </div>

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

            <label id="hamburger" className="hamburger cursor-pointer md:block lg:hidden">
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
          id="mobileOverlay"
          className="fixed left-0 right-0 bottom-0 z-[100] lg:hidden"
          style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
          aria-hidden="false"
        >
          {/* Dark backdrop over content only (not over header) – clicking closes menu */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />
          {/* Left-side drawer panel – starts below header */}
          <aside
            className={cn(
              "fixed left-0 bottom-0 z-[101] w-[300px] max-w-[85vw] bg-black overflow-y-auto shadow-xl transition-transform duration-300 ease-out",
              drawerSlideOpen ? "translate-x-0" : "-translate-x-full"
            )}
            style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col px-6 pt-8 pb-8 space-y-0">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-white text-base font-medium tracking-tight transition-colors duration-200 uppercase py-4 border-b border-gray-600",
                    "hover:text-green-500",
                    isActiveLink(link) && "text-green-500"
                  )}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{ fontFamily: "'Goldman', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}

              <div className="relative group mt-0 border-b border-gray-600">
                <button
                  type="button"
                  className="flex items-center w-full py-4 text-left text-white font-medium focus:outline-none justify-between"
                  tabIndex={0}
                  style={{ fontFamily: "'Goldman', sans-serif" }}
                >
                  <span className="text-base font-medium tracking-tight uppercase">Data Tools</span>
                  <svg className="ml-2 w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <Link
                  href={"/data-tools" as Route<"/data-tools">}
                  className="block px-0 py-3 text-white hover:text-green-500 transition-colors text-sm"
                  onClick={closeMobileMenu}
                  style={{ fontFamily: "'Goldman', sans-serif" }}
                >
                  Auto Dashboard Generator
                </Link>
              </div>
            </nav>
          </aside>
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
        @media only screen and (device-width: 1024px) and (device-height: 1366px),
        only screen and (device-width: 1366px) and (device-height: 1024px) {
          #centerNav { display: none !important; }
          #dataTools { display: none !important; }
          #hamburger { display: block !important; }
          #mobileOverlay { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;