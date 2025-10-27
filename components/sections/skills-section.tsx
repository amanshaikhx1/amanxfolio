"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  FileText,
  Users,
  FileSignature,
  Brain,
  MessageCircle,
  Laptop2,
  BarChart3,
  Settings,
  ClipboardList,
  Shapes,
  Filter,
  Eye,
  PieChart,
  MonitorSmartphone,
  Database,
  LineChart,
  Briefcase,
  Sigma,
} from "lucide-react";

interface SkillItemProps {
  title: string;
  percentage: number;
  // animation trigger from parent (single IO)
  animate: boolean;
  delay?: number;
  reduceMotion?: boolean;
}

const SkillItem = memo(({ title, percentage, animate, delay = 0, reduceMotion }: SkillItemProps) => {
  const [width, setWidth] = useState<string>("0%");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Hydration-safe: animate only after parent says so
    if (reduceMotion) {
      setWidth(`${percentage}%`);
      return;
    }
    if (animate) {
      timeoutRef.current = window.setTimeout(() => {
        setWidth(`${percentage}%`);
      }, delay);
    }
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [animate, delay, percentage, reduceMotion]);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300">{title}</h4>
        <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
        <span
          className="block h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-[width] duration-1000 ease-out [will-change:width] transform-gpu"
          style={{ width }}
        />
      </div>
    </div>
  );
});
SkillItem.displayName = "SkillItem";

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Respect user/device motion preference
  const reduceMotion = useMemo(
    () => (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) || false,
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Single IntersectionObserver for the whole section
  useEffect(() => {
    if (!sectionRef.current || reduceMotion) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setAnimate(true);
          io.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    io.observe(sectionRef.current);

    return () => io.disconnect();
  }, [reduceMotion]);

  const skillCategories = useMemo(
  () => [
    {
      icon: <LineChart className="h-5 w-5" />,
      title: "Data Analysis & Interpretation",
      skills: [
        { title: "Exploratory Data Analysis (EDA)", percentage: 92, icon: <BarChart3 className="h-4 w-4" /> },
        { title: "Data Cleaning & Preparation", percentage: 94, icon: <Filter className="h-4 w-4" /> },
        { title: "Data Interpretation & Insights", percentage: 90, icon: <Eye className="h-4 w-4" /> },
        { title: "Statistical Analysis", percentage: 85, icon: <Sigma className="h-4 w-4" /> },
      ],
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Data Tools & Technologies",
      skills: [
        { title: "Excel (Advanced Formulas, Pivot Tables)", percentage: 95 },
        { title: "SQL (MySQL, PostgreSQL)", percentage: 90 },
        { title: "Power BI (Dashboards & Reports)", percentage: 88 },
        { title: "Tableau (Data Visualization)", percentage: 82 },
        { title: "Python (Pandas, NumPy, Matplotlib)", percentage: 80 },
      ],
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Business & Domain Understanding",
      skills: [
        { title: "Requirement Gathering", percentage: 90 },
        { title: "Business Problem Solving", percentage: 88 },
        { title: "Data-driven Decision Making", percentage: 87 },
        { title: "Reporting & Presentation", percentage: 85 },
      ],
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Soft Skills & Collaboration",
      skills: [
        { title: "Analytical Thinking", percentage: 92, icon: <Brain className="h-4 w-4" /> },
        { title: "Communication & Storytelling", percentage: 90, icon: <MessageCircle className="h-4 w-4" /> },
        { title: "Problem Solving", percentage: 88 },
        { title: "Team Collaboration (Agile/JIRA)", percentage: 84 },
      ],
    },
  ],
  []
);


  return (
    <section
      id="skills"
      ref={sectionRef}
      // NOTE:
      // - overflow-hidden only on md+ (mobile pe hata diya)
      // - backdrop-blur & heavy shadow bhi sirf md+ pe
      className="py-16 md:py-28 bg-[rgb(197,203,211,0.5)] dark:bg-gray-900 relative md:overflow-hidden transition-colors duration-500"
      suppressHydrationWarning
    >
      {/* Lightweight background orb (smaller on mobile), no pointer hit, GPU-friendly */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-br from-green-500/10 to-transparent transform-gpu" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-3 md:mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              My Speciality
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-24 after:h-1 after:bg-green-500 after:mx-auto">
            My Skills
          </h2>
        </div>

        <div className="p-5 md:p-10 rounded-xl bg-white dark:bg-[#030712] border border-gray-200 dark:border-white/10 md:backdrop-blur-sm md:shadow-xl transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {skillCategories.map((category, index) => (
              <div key={index}>
                <h3 className="flex items-center text-lg font-semibold mb-4 relative text-gray-900 dark:text-white bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  <span className="text-green-600 dark:text-green-500 mr-2">{category.icon}</span>
                  {category.title}
                  <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-green-500 to-green-400 rounded" />
                </h3>

                {category.skills.map((skill, skillIndex) => (
                  <SkillItem
                    key={skillIndex}
                    title={skill.title}
                    percentage={skill.percentage}
                    // stagger kept but lighter
                    delay={reduceMotion ? 0 : skillIndex * 90 + index * 70}
                    animate={mounted && (reduceMotion ? true : animate)}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(SkillsSection);
