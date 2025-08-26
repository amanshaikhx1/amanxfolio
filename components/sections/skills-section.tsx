"use client";

import { Server, Database, Network, Cloud } from "lucide-react"
import { useEffect, useRef, useState, memo } from "react";
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
} from "lucide-react";

interface SkillItemProps {
  title: string;
  percentage: number;
  delay?: number;
}

const SkillItem = memo(({ title, percentage, delay = 0 }: SkillItemProps) => {
  const progressRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (progressRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(progressRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [delay]);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300">
          {title}
        </h4>
        <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
        <span
          ref={progressRef}
          className="block h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: visible ? `${percentage}%` : "0%" }}
        ></span>
      </div>
    </div>
  );
});
SkillItem.displayName = "SkillItem";

const skillCategories = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Business Analysis",
    skills: [
      { title: "Requirement Gathering & Documentation", percentage: 95 },
      { title: "Stakeholder Communication", percentage: 92 },
      { title: "BRD, FRD & User Stories", percentage: 90 },
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Soft Skills & Communication",
    skills: [
      { title: "Critical Thinking", percentage: 92, icon: <Brain className="h-4 w-4" /> },
      { title: "Analytical Problem Solving", percentage: 90 },
      { title: "Verbal & Written Communication", percentage: 94, icon: <MessageCircle className="h-4 w-4" /> },
    ],
  },
  {
    icon: <Laptop2 className="h-5 w-5" />,
    title: "Tools & Technologies",
    skills: [
      { title: "Microsoft Excel (Advanced)", percentage: 95 },
      { title: "Power BI (Dashboards)", percentage: 90, icon: <BarChart3 className="h-4 w-4" /> },
      { title: "SQL (MySQL, PostgreSQL)", percentage: 88, icon: <Database className="h-4 w-4" /> },
      { title: "JIRA / Confluence", percentage: 85, icon: <Settings className="h-4 w-4" /> },
      { title: "Tableau", percentage: 72, icon: <PieChart className="h-4 w-4" /> },
      { title: "UML / Use Case Diagrams", percentage: 80, icon: <Shapes className="h-4 w-4" /> },
      { title: "Python", percentage: 75, icon: <Shapes className="h-4 w-4" /> },
    ],
  },
  {
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Data Handling & Visualization",
    skills: [
      { title: "Data Cleaning & Validation", percentage: 90, icon: <Filter className="h-4 w-4" /> },
      { title: "Data Interpretation", percentage: 88, icon: <Eye className="h-4 w-4" /> },
      { title: "Report Building", percentage: 85, icon: <FileSignature className="h-4 w-4" /> },
      { title: "Dashboarding (Power BI/Tableau)", percentage: 82, icon: <MonitorSmartphone className="h-4 w-4" /> },
      { title: "Data-driven Decision Support", percentage: 87 },
    ],
  },
];

const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="py-16 md:py-28 bg-[rgb(197,203,211,0.5)] dark:bg-gray-900 relative overflow-hidden transition-colors duration-500"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-500/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              My Speciality
            </span>
          </div>

          {/* Heading with green underline */}
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-24 after:h-1 after:bg-green-500 after:mx-auto">
            My Skills
          </h2>
        </div>

        <div className="p-6 md:p-10 rounded-xl bg-white dark:bg-[#030712] backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-xl transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((category, index) => (
              <div key={index}>
                <h3 className="flex items-center text-lg font-semibold mb-4 relative text-gray-900 dark:text-white bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  <span className="text-green-600 dark:text-green-500 mr-2">
                    {category.icon}
                  </span>
                  {category.title}
                  <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-green-500 to-green-400 rounded" />
                </h3>

                {category.skills.map((skill, skillIndex) => (
                  <SkillItem
                    key={skillIndex}
                    title={skill.title}
                    percentage={skill.percentage}
                    delay={skillIndex * 120 + index * 80} // ⚡ staggered animation
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