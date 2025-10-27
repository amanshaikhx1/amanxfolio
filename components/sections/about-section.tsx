"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User, Mail, MapPin, Download, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-gray-50 dark:bg-gray-950 relative overflow-hidden"
    >
      {/* Decorative Blobs (optimized with will-change & aria-hidden) */}
      <div
        className="absolute top-[-250px] left-[-250px] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-green-500/10 to-transparent will-change-transform"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-200px] right-[-200px] w-[350px] h-[350px] rounded-full bg-gradient-to-tl from-blue-500/10 to-transparent will-change-transform"
        aria-hidden="true"
      />

      <div className="container mx-auto px-5 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              Get to know me
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-24 after:h-1 after:bg-green-500 after:mx-auto">
            About Me
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Profile Image */}
          <motion.div
            className="w-full md:w-2/5 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative inline-block">
              <Image
                src="/amansk.jpg"
                alt="Aman Shaikh profile photo"
                width={400}
                height={500}
                loading="lazy" // priority hataya for better performance
                quality={60}
                className="rounded-lg shadow-xl border-4 border-gray-200 dark:border-gray-800 transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            className="w-full md:w-3/5"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-6 relative pb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Hello! I am Aman Shaikh
              <span className="absolute left-0 bottom-0 w-12 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded"></span>
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              I am a motivated BCA student at Amity University (3rd semester), passionate about transforming raw data into actionable insights. My short-term focus is building a strong foundation in Data Analytics, gaining hands-on experience with SQL, Excel, Python, and data visualization tools, and contributing to real-world projects that drive business decisions.

Alongside my academic journey, I am continuously developing my knowledge in Data Scientist and Machine Learning, preparing for a future transition from a Data Analyst role to a Data Scientist. I am deeply interested in solving complex problems using data, uncovering patterns, and enabling data-driven strategies.
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 rounded-lg bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm border border-white/10 dark:border-gray-800/50 shadow-lg">
              <InfoItem icon={<User size={18} />} label="Aman Shaikh" />

              <InfoItem
                icon={<Mail size={18} />}
                label="amanshaikhx01@gmail.com"
                href="mailto:amanshaikhx01@gmail.com"
              />

              <InfoItem icon={<MapPin size={18} />} label="Mumbai, IND" />

              <InfoItem
                icon={<Linkedin size={18} />}
                label="LinkedIn"
                href="https://www.linkedin.com/in/amanshaikhx01"
              />
            </div>

            {/* CV Button */}
            <Button
              asChild
              className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white rounded-full px-6 py-3 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 transition-all group"
            >
              <a
                href="/Aman-Shaikh-Resume.pdf"
                download
                aria-label="Download Aman Shaikh CV"
              >
                Download CV
                <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);

// Sub-component for contact info
const InfoItem = memo(
  ({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
        {icon}
      </div>
      <h4 className="text-gray-700 dark:text-gray-300">
        {href ? (
          <a href={href} className="hover:underline" target="_blank" rel="noopener noreferrer" aria-label={label}>
            {label}
          </a>
        ) : (
          label
        )}
      </h4>
    </div>
  )
);
