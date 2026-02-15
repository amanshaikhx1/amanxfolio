"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import styled from "styled-components";

const educationData = [
  {
    year: "2024 - 2027",
    degree: "Bachelor of Computer Applications",
    university: "Amity University",
    description:
      "Pursuing BCA with a strong focus on Java backend engineering, DSA, DBMS, and core computer science fundamentals. Building hands-on backend projects using Spring Boot and REST APIs while exploring cloud and deployment fundamentals.",
  },
  {
    year: "2027 - 2029 (Planned)",
    degree: "Master of Science ( Computer Science)",
    university: "Heriot-Watt University",
    description:
      "Planning to pursue a Master’s in Computer Science with a focus on advanced software engineering, backend systems, distributed architecture, and cloud computing. Aiming to deepen expertise in scalable system design and real-world engineering practices.",
  },
  {
    year: "2026 (Jan) - 2026 (Dec)",
    degree: "Professional Certificate in Software Engineering",
    university: "IIT Roorkee iHub DivyaSampark",
    description:
      "Currently pursuing a Software Engineering certification with guidance from industry-experienced mentors and hands-on project development.",
  },
];

const experienceData = [
  {
    year: "2025",
    position: "Java Backend Developer – Learning in Progress",
    company: "Independent / Self-Paced",
    description:
      "Learning Java backend development through hands-on projects, DSA practice, and building REST APIs with Spring Boot and SQL.",
  },
  {
    year: "2026",
    position: "Software Engineering Certification – In Progress",
    company: "Industry-Guided Program",
    description:
      "Completing a software engineering certification with industry-mentor guidance and practical project-based training.",
  },
  {
    year: "2027 (Target)",
    position: "Entry-Level Software Engineer / Java Backend Role",
    company: "Open to Backend & SWE Opportunities",
    description:
      "Targeting entry-level software engineering roles to apply backend skills and problem-solving in real-world systems.",
  },
];


// ─── Pattern for Light Mode ───
const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="container" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  .container {
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to bottom,
        #fff 0%,
        #fff 40%,
        rgba(255, 255, 255, 0) 100%
      ),
      linear-gradient(to right, #0ed2da, #5f29c7);
    position: relative;
    overflow: hidden;
  }

  .container::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(90deg, #ccc 1px, transparent 1px);
    background-size: 50px 100%;
    pointer-events: none;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 70%
    );
  }
`;

// ─── Resume Item ───
const ResumeItem = memo(
  ({
    data,
    index,
    type,
  }: {
    data: {
      year: string;
      degree?: string;
      position?: string;
      university?: string;
      company?: string;
      description: string;
    };
    index: number;
    type: "education" | "experience";
  }) => {
    return (
      <motion.div
        className="
          relative pl-10 pr-6 py-8 
          border-b border-gray-200 dark:border-gray-700/50 
          last:border-none group
        "
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div
          className="
            absolute left-[-12px] top-8 w-6 h-6 rounded-full 
            bg-green-500 border-2 
            border-white dark:border-gray-900 
            z-20 shadow-sm
          "
        />

        <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
          {type === "education" ? data.degree : data.position}
        </h4>

        <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
          {type === "education" ? data.university : data.company} — {data.year}
        </h5>

        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
          {data.description}
        </p>
      </motion.div>
    );
  }
);

// ─── Main Section ───
const ResumeSection = memo(() => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      id="resume"
      className={`
        py-20
        relative
        overflow-hidden
        bg-gray-50 dark:bg-[rgb(3,7,18)]
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
      `}
    >
      {/* Light mode only: show pattern background */}
      {mounted && !isDark && <Pattern />}

      {/* Light mode readability improvement */}
      {mounted && !isDark && (
        <div className="absolute inset-0 bg-white/65 dark:bg-transparent z-0 pointer-events-none" />
      )}

      {/* Dark mode only: cosmic nebula background */}
      {mounted && isDark && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147, 51, 234, 0.12), transparent 55%),
              radial-gradient(ellipse 130% 60% at 75% 15%, rgba(59, 130, 246, 0.10), transparent 65%),
              radial-gradient(ellipse 80% 90% at 20% 30%, rgba(236, 72, 153, 0.14), transparent 50%),
              radial-gradient(ellipse 100% 40% at 60% 70%, rgba(16, 185, 129, 0.08), transparent 45%),
              #000000
            `,
            opacity: 0.9,
          }}
        />
      )}

      <div className="container mx-auto px-5 relative z-10">
        <div className="text-center mb-16">
          <span
            className="
              inline-block px-4 py-1 text-sm font-medium rounded-full 
              bg-green-600/10 text-green-700 
              dark:bg-green-500/15 dark:text-green-400
            "
          >
            My Resume
          </span>
          <h2
            style={{ fontFamily: "'Black Ops One', sans-serif" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2"
          >
            Education & Experience
          </h2>
          <div className="w-16 h-1 bg-green-500 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Education :-
            </h3>
            <div
              className="
                relative 
                bg-white/90 dark:bg-[rgb(17,24,39)] 
                backdrop-blur-[2px] dark:backdrop-blur-none
                rounded-2xl 
                border-l-4 md:border-l-[6px] border-green-500 
                shadow-xl dark:shadow-none 
                overflow-hidden
                transition-all duration-300
              "
            >
              {educationData.map((item, index) => (
                <ResumeItem key={index} data={item} index={index} type="education" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Experience :-
            </h3>
            <div
              className="
                relative 
                bg-white/90 dark:bg-[rgb(17,24,39)] 
                backdrop-blur-[2px] dark:backdrop-blur-none
                rounded-2xl 
                border-l-4 md:border-l-[6px] border-green-500 
                shadow-xl dark:shadow-none 
                overflow-hidden
                transition-all duration-300
              "
            >
              {experienceData.map((item, index) => (
                <ResumeItem key={index} data={item} index={index} type="experience" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ResumeSection;