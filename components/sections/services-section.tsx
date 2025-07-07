"use client"

import { motion } from "framer-motion"
import { Lightbulb, Code, TrendingUp, Headphones } from "lucide-react"
import SectionTitle from "@/components/section-title"

const services = [
  {
    Icon: Lightbulb,
    title: "System Design & Architecture",
    description:
      "Designing robust, high-performance architectures – from monolith to microservices, using caching, load balancing, and scalable design principles.",
    color: "green",
  },
  {
    Icon: Code,
    title: "Backend Development",
    description:
      "Scalable and secure RESTful API development using Spring Boot and Node.js. Database integration with MySQL, PostgreSQL, MongoDB, and Redis.",
    color: "blue",
  },
  {
    Icon: TrendingUp,
    title: "Cloud & DevOps Solutions",
    description:
      "Deployment and CI/CD on AWS, GCP, or Azure with Docker, Kubernetes, Terraform, Jenkins, and GitHub Actions. Cloud-native and containerized app delivery.",
    color: "green",
  },
  {
    Icon: Headphones,
    title: "Frontend Integration",
    description:
      "Clean and responsive UI using HTML, CSS, JavaScript, and AI-generated components – integrated smoothly with backend systems for complete full-stack projects.",
    color: "blue",
  },
]

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-5 relative z-10">
        <SectionTitle subtitle="What I Do" title="My Services" />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {services.map(({ Icon, title, description, color }, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className={`p-8 rounded-2xl border-b-4 text-center shadow-lg bg-white/80 dark:bg-gray-800/80 
              backdrop-blur-sm transition-all hover:-translate-y-2 duration-300 
              ${
                color === "green"
                  ? "border-green-400 hover:shadow-green-300/40"
                  : "border-blue-400 hover:shadow-blue-300/40"
              }`}
            >
              <div
                className={`w-16 h-16 mb-6 mx-auto rounded-full flex items-center justify-center 
                text-white text-xl transition-all duration-500 
                ${
                  color === "green"
                    ? "bg-gradient-to-br from-green-500 to-green-400"
                    : "bg-gradient-to-br from-blue-500 to-blue-400"
                }`}
              >
                <Icon className="w-7 h-7" />
              </div>

              <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {title}
              </h4>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection
