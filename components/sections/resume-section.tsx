"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/section-title";

const educationData = [
  {
    year: "2024 - 2027",
    degree: "Bachelor of Computer Applications",
    university: "Amity University",
    description:
      "Pursuing BCA with a focus on data analysis, business systems, and analytical problem-solving. Skilled in Excel and SQL, and developing expertise in transforming data into actionable insights through projects.",
  },
  {
    year: "2027 - 2029",
    degree: "Master of Science ( Data Science )",
    university: "Amity University",
    description:
      "Planning to pursue a Master's in Data Science to deepen expertise in machine learning, advanced analytics, and data-driven problem-solving. Aiming to strengthen technical and research skills for real-world data applications.",
  },
  {
    year: "2028",
    degree: "IIBA® Certification in Business Data Analytics (CBDA)",
    university: "International Institute of Business Analysis (IIBA)",
    description:
      "Planning to earn the CBDA certification to validate expertise in business data analytics, including data interpretation, insight generation, and data-driven decision-making for business impact.",
  },
];

const experienceData = [
  {
    year: "2025",
    position: "Aspiring Data Analyst – Learning in Progress",
    company: "Independent / Self-Paced",
    description:
      "Building a strong foundation in data analysis through self-learning and academic projects. Gaining hands-on experience with Excel, SQL, Power BI, and Python while exploring techniques for data cleaning, visualization, and insight generation.",
  },
  {
    year: "2026 (Planned)",
    position: "CBDA Certification Preparation – IIBA®",
    company: "Remote / Independent",
    description:
      "Preparing for the IIBA® CBDA certification with focus on business data analytics, data interpretation, and insight generation. Practicing real-world case studies to apply data-driven decision-making using Excel, Power BI, and SQL.",
  },
  {
    year: "2027 (Planned)",
    position: "Entry-Level Data Analyst Role",
    company: "Open to Opportunities Across Industries",
    description:
      "Aiming to apply academic and project experience in real-world analytics. Focused on data cleaning, visualization, and insight generation to support data-driven business decisions in cross-functional environments.",
  },
];

const ResumeItem = memo(
  ({
    data,
    index,
    type,
  }: {
    data: any;
    index: number;
    type: "education" | "experience";
  }) => {
    return (
      <motion.div
        className="relative pl-8 mb-10 last:mb-0 group"
        initial={{ opacity: 0, x: type === "education" ? -25 : 25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
      >
        <div
          className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-green-500 to-transparent"
          aria-hidden="true"
        ></div>
        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/30 group-hover:scale-150 transition-transform duration-300"></div>

        <span className="inline-block px-4 py-1 mb-3 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
          {data.year}
        </span>

        <h4 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors duration-300">
          {type === "education" ? data.degree : data.position}
        </h4>

        <h5 className="text-base italic mb-3 text-gray-600 dark:text-gray-400">
          {type === "education" ? data.university : data.company}
        </h5>

        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          {data.description}
        </p>
      </motion.div>
    );
  }
);

const ResumeSection = memo(() => {
  return (
    <section
      id="resume"
      className="py-20 md:py-32 bg-white dark:bg-[#030712] relative overflow-hidden transition-colors duration-500"
      aria-labelledby="resume-title"
    >
      <div className="container mx-auto px-5 relative z-10">
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              My Resume
            </span>
          </div>

          <h2
            id="resume-title"
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-24 after:h-1 after:bg-green-500 after:mx-auto"
          >
            Education & Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pl-5 relative text-gray-800 dark:text-white bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-500 to-green-400 rounded"></span>
              Education
            </h3>

            {educationData.map((item, index) => (
              <ResumeItem
                key={`edu-${index}`}
                data={item}
                index={index}
                type="education"
              />
            ))}
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pl-5 relative text-gray-800 dark:text-white bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-500 to-green-400 rounded"></span>
              Experience
            </h3>

            {experienceData.map((item, index) => (
              <ResumeItem
                key={`exp-${index}`}
                data={item}
                index={index}
                type="experience"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ResumeSection;
