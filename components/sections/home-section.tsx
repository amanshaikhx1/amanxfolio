"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// 👉 Lightweight Background import
import HomeBackground from "@/components/homebackground";

// ✅ Dynamic import for TypeAnimation (no blocking SSR)
const TypeAnimation = dynamic(
  () => import("react-type-animation").then((mod) => mod.TypeAnimation),
  {
    ssr: false,
    loading: () => <span className="text-green-500">Loading...</span>,
  }
);

const HomeSection = () => {
  const mouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mouseRef.current) {
        const scrollY = window.scrollY;
        mouseRef.current.style.opacity =
          scrollY < 300 ? (1 - scrollY / 300).toString() : "0";
      }
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center min-h-screen w-full overflow-hidden bg-[#0a0a0a]"
    >
      {/* Home section background – stars, lines, glow */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0 min-h-full w-full">
        <HomeBackground />
      </div>

      {/* Scroll Indicator */}
      <div
        ref={mouseRef}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-white text-3xl animate-bounce"
      >
        ↓
      </div>

      {/* Content */}
      <div className="container mx-auto px-5 relative z-150">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">

          {/* Main Content (center) - moved to center vertically */}
          <motion.div
            className="w-full md:w-2/3 text-center md:text-left px-4 md:px-8 flex items-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="md:pl-6 lg:pl-12 mt-32 md:mt-0">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-black/40 text-green-500 font-semibold rounded">MY DIGITAL SPACE</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-2 text-white font-saira-stencil">
                Aman Shaikh
              </h1>

              <h2 className="text-3xl md:text-5xl text-white/90 mb-6 font-vt323">SOFTWARE ENGINEER</h2>

              <p className="max-w-2xl mx-auto md:mx-0 text-gray-300 mb-6">
                A Passionate Java Backend Student Focused On Scalable Systems And High-Performance Backend Development, Practicing DSA And Exploring Cloud Technologies.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white rounded-full px-6 py-3 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 transition-all group"
                >
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        window.scrollTo({
                          top: contactSection.offsetTop - 80,
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    Hire Me
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>

              </div>
            </div>
          </motion.div>

          {/* Image Column (right) */}
          <motion.div
            className="w-full md:w-1/3 max-w-none md:max-w-md mx-auto h-64 md:h-auto -mt-8 md:mt-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative profile-container">
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-green-500/20 filter blur-md animate-pulse-slow"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-blue-500/20 filter blur-md animate-pulse-slow animation-delay-1000"></div>

              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] opacity-60 blur-sm animate-morph-slow"></div>

              <div className="relative rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden border-2 border-white/30 dark:border-gray-800/50 shadow-2xl animate-morph bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 mix-blend-overlay"></div>
                <Image
                  src="/aman.jpg"
                  alt="Aman Shaikh"
                  width={400}
                  height={400}
                  priority
                  className="w-full h-auto object-cover scale-105 hover:scale-110 transition-transform duration-700"
                  quality={70}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
