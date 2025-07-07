"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Trophy, Code, LaptopIcon as LaptopCode, Award } from "lucide-react"
import SectionTitle from "@/components/section-title"

const achievementCards = [
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "HackerRank",
    achievements: [
      "5-Star Gold Badge in Problem Solving",
      "6-Star Gold Badge in Java Programming",
      "4-Star Silver Badge in SQL",
      "Ranked in top 5% globally",
    ],
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "LeetCode",
    achievements: [
      "Solved 500+ problems",
      "Top 10% in Weekly Contests",
      "Knight Badge (2000+ rating)",
      "Completed all Dynamic Programming challenges",
    ],
  },
  {
    icon: <LaptopCode className="h-6 w-6" />,
    title: "Hackathons",
    achievements: [
      "1st Place - Cloud Innovation Hackathon 2023",
      "2nd Place - Global API Hackathon 2022",
      "Finalist - Microsoft Azure Challenge 2021",
      "Best Technical Implementation - DevFest 2022",
    ],
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Certifications",
    achievements: [
      "AWS Certified Solutions Architect",
      "Microsoft Certified: Azure Developer Associate",
      "MongoDB Certified Developer",
      "Certified Kubernetes Administrator (CKA)",
    ],
  },
]

const stats = [
  { number: "500+", label: "Coding Problems Solved" },
  { number: "12", label: "Hackathons Participated" },
  { number: "8", label: "Professional Certifications" },
  { number: "4", label: "Hackathon Wins" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const AchievementCard = memo(({ card, index }: { card: any; index: number }) => (
  <motion.div
    key={`card-${index}`}
    variants={itemVariants}
    className="flex gap-5 p-6 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    <div className="w-14 h-14 min-w-[56px] rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
      {card.icon}
    </div>
    <div>
      <h4 className="text-xl font-semibold mb-4 pb-2 relative bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {card.title}
        <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-green-500 to-green-400 rounded"></span>
      </h4>
      <ul className="space-y-2 leading-relaxed">
        {card.achievements.map((achievement: string, i: number) => (
          <li key={`ach-${index}-${i}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 group hover:translate-x-1 transition-transform">
            <span className="text-green-500 min-w-[20px]">
              <Award className="h-4 w-4" />
            </span>
            {achievement}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
))

const StatCard = memo(({ stat, index }: { stat: any; index: number }) => (
  <motion.div
    key={`stat-${index}`}
    variants={itemVariants}
    className="text-center p-6 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
      {stat.number}
    </div>
    <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
  </motion.div>
))

const AchievementsSection = () => {
  return (
    <section id="achievements" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute top-1/2 right-[-300px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-transparent -translate-y-1/2"></div>

      <div className="container mx-auto px-5 relative z-10">
        <SectionTitle subtitle="My Accomplishments" title="Achievements" />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {achievementCards.map((card, index) => (
            <AchievementCard key={index} card={card} index={index} />
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default memo(AchievementsSection)
