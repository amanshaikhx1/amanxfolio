"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, X, ArrowRight } from "lucide-react"

const portfolioItems = [
  {
    id: "portfolio-1",
    title: "Work in progress",
    category: "---",
    image: "/P1.webp",
    date: "---",
    tech: "---",
    description: "Work in progress, Projects will be added soon.",
    link: "https://projectsaddsoon.com",
  },
  {
    id: "portfolio-2",
    title: "Work in progress",
    category: "---",
    image: "/P2.webp",
    date: "---",
    tech: "---",
    description: "Work in progress, Projects will be added soon.",
  },
  {
    id: "portfolio-3",
    title: "Work in progress",
    category: "---",
    image: "/P3.webp",
    date: "---",
    tech: "---",
    description: "Work in progress, Projects will be added soon.",
    link: "https://projectsaddsoon.com",
  },
]

const ProjectsSection = () => {
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showButtonId, setShowButtonId] = useState<string | null>(null)

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle modal open/close
  const openModal = (item: typeof portfolioItems[0]) => setSelectedItem(item)
  const closeModal = useCallback(() => setSelectedItem(null), [])

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : ""
  }, [selectedItem])

  // Allow ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    if (selectedItem) window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedItem, closeModal])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section
      id="projects"
      className="py-20 md:py-32 bg-[rgb(197,203,211,0.5)] dark:bg-gray-900 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              My Recent
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
          dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block 
          after:content-[''] after:block after:mt-2 after:w-20 after:h-1 after:bg-green-500 after:mx-auto">
            Projects
          </h2>
        </div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl 
              transition-transform transform hover:-translate-y-2 cursor-pointer relative"
              onClick={() =>
                isMobile ? setShowButtonId(prev => prev === item.id ? null : item.id) : openModal(item)
              }
            >
              {/* Project Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* WIP Badge */}
                <span className="absolute top-2 left-2 bg-yellow-500/90 text-white text-xs px-2 py-1 rounded-md">
                  Coming Soon
                </span>
              </div>

              {/* Hover Button (Desktop) */}
              {!isMobile && (
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/80 to-green-400/60 opacity-0 
                group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(item)
                    }}
                    className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/50 transition-all"
                    aria-label="View Project"
                  >
                    <ExternalLink className="text-white w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Tap to Reveal (Mobile) */}
              {isMobile && showButtonId === item.id && (
                <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(item)
                    }}
                    className="bg-white text-green-600 font-semibold px-5 py-2 rounded-full flex items-center gap-2 hover:bg-gray-100"
                  >
                    View Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Card Footer */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-green-500 text-sm">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] relative"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center 
                  backdrop-blur-md text-black hover:bg-white/30 transition-all"
                  onClick={closeModal}
                  aria-label="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Content */}
                <div className="flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
                  <div className="md:w-1/2 w-full">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      loading="lazy"
                      className="rounded-lg object-cover w-full h-auto"
                    />
                  </div>

                  <div className="md:w-1/2 w-full space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedItem.title}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-green-500 font-medium">Category:</p>
                        <p className="text-gray-600 dark:text-gray-300">{selectedItem.category}</p>
                      </div>
                      <div>
                        <p className="text-green-500 font-medium">Date:</p>
                        <p className="text-gray-600 dark:text-gray-300">{selectedItem.date}</p>
                      </div>
                      <div>
                        <p className="text-green-500 font-medium">Technologies:</p>
                        <p className="text-gray-600 dark:text-gray-300">{selectedItem.tech}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-green-500 font-medium">Description:</p>
                      <p className="text-gray-600 dark:text-gray-300">{selectedItem.description}</p>
                    </div>

                    {selectedItem.link && (
                      <a
                        href={selectedItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white 
                        rounded-full shadow hover:from-green-600 hover:to-green-500 transition-transform transform hover:-translate-y-1"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ProjectsSection
