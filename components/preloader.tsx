"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out preloader after 1s to avoid blocking LCP
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Only render on client to avoid hydration mismatches
  if (typeof window === "undefined") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black flex justify-center items-center transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      suppressHydrationWarning // Handle browser extension attributes like bis_skin_checked
    >
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 border-4 border-green-200/20 border-t-green-500 rounded-full animate-spin will-change-transform"
          style={{ animationDuration: "1.2s" }}
        />
        <div
          className="absolute inset-2 border-4 border-blue-200/20 border-t-blue-500 rounded-full animate-spin will-change-transform"
          style={{ animationDuration: "1s", animationDirection: "reverse" }}
        />
      </div>
    </div>
  );
};

export default Preloader;