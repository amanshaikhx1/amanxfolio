"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const GlobalBackground = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleReducedMotionChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleReducedMotionChange);

      return () => {
        mediaQuery.removeEventListener("change", handleReducedMotionChange);
      };
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-700",
          theme === "dark"
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          "bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none",
          "bg-radial-vignette"
        )}
      />
    </div>
  );
};

export default GlobalBackground;
