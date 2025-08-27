"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// 👉 DarkVeil background import
import DarkVeil from "@/components/darkveilbackground";

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
      className="relative flex items-center min-h-screen w-full overflow-hidden"
    >
      {/* ✅ DarkVeil Background */}
      <div className="absolute inset-0 -z-10">
        <DarkVeil
          hueShift={30}          // 👈 rang shift (0–360)
          noiseIntensity={0}     // 👈 clean background (0 = no noise)
          scanlineIntensity={0}  // 👈 disable scanlines
          speed={0.5}            // 👈 animation speed
          scanlineFrequency={0}  // 👈 disable scanline effect
          warpAmount={0}      // 👈 thoda warp distortion
          resolutionScale={1}    // 👈 quality control
        />
      </div>

      {/* Scroll Indicator */}
      <div
        ref={mouseRef}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-white text-3xl animate-bounce"
      >
        ↓
      </div>

      {/* Content */}
      <div className="container mx-auto px-5 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Text Section */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="md:pl-20">
              <h3 className="text-xl md:text-2xl text-gray-400 mb-2 md:mb-3 inline-block relative pl-0 md:pl-10">
                <span className="hidden md:inline-block absolute left-0 top-1/2 w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-400 -translate-y-1/2"></span>
                Hey, My name is
              </h3>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 relative text-white dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-gray-300 dark:bg-clip-text">
                Aman Shaikh
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-32 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded"></span>
              </h1>

              <p className="text-xl md:text-2xl mb-6 md:mb-8 flex items-center justify-center md:justify-start">
                <span className="text-white dark:text-inherit">A</span>{" "}
                <span className="text-green-500 font-semibold ml-2 relative">
                  <TypeAnimation
                    sequence={[
                      "Business Data Analyst.",
                      2000,
                      "Data-Driven Decisions.",
                      2000,
                      "Empowering Business with Data",
                      2000,
                    ]}
                    speed={50}
                    repeat={Infinity}
                  />
                </span>
              </p>

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
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="w-full md:w-1/2 max-w-md mx-auto"
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
