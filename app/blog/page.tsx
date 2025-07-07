"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

// Direct blog data - no API calls needed
const blogData = [
  {
    id: "1",
    title: "10 Essential UI/UX Design Principles Every Developer Should Know",
    slug: "ui-ux-design-principles",
    content: "User Interface (UI) and User Experience (UX) design are critical components...",
    excerpt:
      "Learn the fundamental UI/UX design principles that every developer should master to create better user experiences.",
    category: "Design",
    author: "Aman Shaikh",
    authorImage: "/placeholder.svg?height=30&width=30",
    image: "blog.webp",
    readTime: "5 min read",
    tags: ["Design", "UI/UX", "Web Development"],
    date: {
      day: "15",
      month: "Jan",
      year: "2024",
    },
    publishedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Introduction to Artificial Intelligence: The Future is Now",
    slug: "introduction-to-artificial-intelligence",
    content: "Artificial Intelligence (AI) is no longer a concept confined to science fiction...",
    excerpt:
      "Explore the world of Artificial Intelligence, its types, current applications, and what the future holds for this transformative technology.",
    category: "Technology",
    author: "Aman Shaikh",
    authorImage: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Artificial+Intelligence",
    readTime: "8 min read",
    tags: ["AI", "Technology", "Machine Learning"],
    date: {
      day: "10",
      month: "Jan",
      year: "2024",
    },
    publishedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    title: "From Junior to Senior Developer: A Roadmap for Career Growth",
    slug: "junior-to-senior-developer-roadmap",
    content: "Navigating the path from junior to senior developer requires more than just technical skills...",
    excerpt:
      "A comprehensive guide to advancing from junior to senior developer, covering technical skills, soft skills, and career strategies.",
    category: "Career",
    author: "Aman Shaikh",
    authorImage: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Career+Growth",
    readTime: "6 min read",
    tags: ["Career", "Development", "Skills"],
    date: {
      day: "05",
      month: "Jan",
      year: "2024",
    },
    publishedAt: "2024-01-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Understanding React Server Components",
    slug: "react-server-components",
    content: "React Server Components represent a paradigm shift in how we build React applications...",
    excerpt:
      "Learn about React Server Components, how they work, their benefits, and when to use them in your applications.",
    category: "React",
    author: "Aman Shaikh",
    authorImage: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=React+Server+Components",
    readTime: "7 min read",
    tags: ["React", "JavaScript", "Frontend"],
    date: {
      day: "01",
      month: "Jan",
      year: "2024",
    },
    publishedAt: "2024-01-01T16:45:00Z",
  },
  {
    id: "5",
    title: "Optimizing Website Performance: A Developer's Guide",
    slug: "website-performance-optimization",
    content: "Website performance directly impacts user experience, conversion rates, and search engine rankings...",
    excerpt:
      "Learn practical techniques for optimizing website performance, improving Core Web Vitals, and creating lightning-fast web experiences.",
    category: "Performance",
    author: "Aman Shaikh",
    authorImage: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Website+Performance",
    readTime: "9 min read",
    tags: ["Performance", "Web Development", "Optimization"],
    date: {
      day: "28",
      month: "Dec",
      year: "2023",
    },
    publishedAt: "2023-12-28T11:20:00Z",
  },
  {
    id: "6",
    title: "Building Accessible Web Applications",
    slug: "building-accessible-web-applications",
    content: "Web accessibility ensures that websites and applications are usable by everyone...",
    excerpt:
      "Learn how to build accessible web applications that work for everyone, covering WCAG guidelines, ARIA, testing strategies, and implementation techniques.",
    category: "Accessibility",
    author: "Aman Shaikh",
    authorImage: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Web+Accessibility",
    readTime: "12 min read",
    tags: ["Accessibility", "Web Development", "Inclusive Design"],
    date: {
      day: "25",
      month: "Dec",
      year: "2023",
    },
    publishedAt: "2023-12-25T13:10:00Z",
  },
  {
    id: "7",
    title: "Future Web Development Trends: What's Coming Next",
    slug: "future-web-development-trends",
    content:
      "The web development landscape is constantly evolving, with new technologies, frameworks, and paradigms emerging regularly...",
    excerpt:
      "Explore the cutting-edge trends shaping the future of web development, from AI-powered coding to WebAssembly, edge computing, and beyond.",
    category: "Technology",
    author: "Aman Shaikh",
    authorImage: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Future+Web+Development",
    readTime: "15 min read",
    tags: ["Future Tech", "Web Development", "AI", "WebAssembly", "Trends"],
    date: {
      day: "20",
      month: "Jan",
      year: "2024",
    },
    publishedAt: "2024-01-20T12:00:00Z",
  },
]

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  author: string
  authorImage: string
  image: string
  readTime: string
  tags: string[]
  date: {
    day: string
    month: string
    year: string
  }
  publishedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")

  const filterBlogs = (search = "") => {
    let filteredBlogs = [...blogData]

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.content.toLowerCase().includes(searchLower) ||
          blog.excerpt.toLowerCase().includes(searchLower) ||
          blog.category.toLowerCase().includes(searchLower) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    return filteredBlogs
  }

  const loadBlogs = (page = 1, search = "") => {
    setLoading(true)

    // Simulate loading delay for better UX
    setTimeout(() => {
      const filteredBlogs = filterBlogs(search)
      const total = filteredBlogs.length
      const limit = 6
      const totalPages = Math.ceil(total / limit)
      const offset = (page - 1) * limit
      const paginatedBlogs = filteredBlogs.slice(offset, offset + limit)

      setBlogPosts(paginatedBlogs)
      setPagination({
        page,
        limit,
        total,
        totalPages,
      })
      setLoading(false)
    }, 300)
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadBlogs(1, searchTerm)
  }

  const handlePageChange = (page: number) => {
    loadBlogs(page, searchTerm)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearSearch = () => {
    setSearchTerm("")
    loadBlogs(1, "")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Original Header */}
      <Header />

      <main className="pt-32 pb-20">
          {/* Page Title */}
          <div className="container mx-auto px-5">
        <div className="text-center mb-16">
          {/* Subtitle badge (My Blog) */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              My Blog
            </span>
          </div>

          {/* Main heading (Latest Articles) with underline */}
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-20 after:h-1 after:bg-green-500 after:mx-auto">
            Latest Articles
          </h2>
        </div>

          <div className="flex flex-col gap-10">
            {/* Main Content */}
            <div className="w-full">
              {/* Search Bar */}
              <div className="mb-8">
                <form onSubmit={handleSearch} className="relative max-w-md">
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                    <button type="submit" className="p-1">
                      <Search className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </form>
                {searchTerm && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {pagination.total > 0
                      ? `Found ${pagination.total} article${pagination.total === 1 ? "" : "s"} for "${searchTerm}"`
                      : `No articles found for "${searchTerm}"`}
                  </p>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-2/5 h-60 md:h-auto bg-gray-300 dark:bg-gray-700"></div>
                        <div className="md:w-3/5 p-6 space-y-4">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm ? "No articles found matching your search." : "No articles available."}
                  </p>
                  {searchTerm && (
                    <Button onClick={clearSearch} variant="outline">
                      Show All Articles
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-8">
                    {blogPosts.map((post) => (
                      <article
                        key={post.id}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="md:w-2/5 relative h-60 md:h-auto">
                          <Image
                            src={post.image || "/placeholder.svg?height=300&width=400"}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 300px"
                          />
                        </div>
                        <div className="md:w-3/5 p-6 flex flex-col">
                          <div className="flex justify-between items-center mb-3 text-sm">
                            <span className="text-green-500 font-medium relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:bg-green-500 before:rounded-full">
                              {post.category}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-green-500" />
                                {post.date.month} {post.date.day}, {post.date.year}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-green-500" />
                                {post.readTime}
                              </span>
                            </div>
                          </div>

                          <h2 className="text-xl md:text-2xl font-semibold mb-3 line-clamp-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="hover:text-green-500 transition-colors hover:from-green-500 hover:to-green-400"
                            >
                              {post.title}
                            </Link>
                          </h2>

                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>

                          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center">
                              <Image
                                src={post.authorImage || "/placeholder.svg?height=30&width=30"}
                                alt={post.author}
                                width={30}
                                height={30}
                                className="w-7 h-7 rounded-full border-2 border-green-500 mr-2"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{post.author}</span>
                            </div>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-green-500 font-medium flex items-center hover:text-green-600 transition-colors group"
                            >
                              Read More
                              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-10">
                      <div className="flex gap-2" role="navigation" aria-label="Blog pagination">
                        {pagination.page > 1 && (
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="w-10 h-10 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium shadow hover:bg-green-500 hover:text-white transition-colors"
                            aria-label="Previous page"
                          >
                            ←
                          </button>
                        )}

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded font-medium shadow transition-colors ${
                              page === pagination.page
                                ? "bg-green-500 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"
                            }`}
                            aria-current={page === pagination.page ? "page" : undefined}
                          >
                            {page}
                          </button>
                        ))}

                        {pagination.page < pagination.totalPages && (
                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium shadow hover:bg-green-500 hover:text-white transition-colors"
                            aria-label="Next page"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Original Footer */}
      <Footer />

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 z-50"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  )
}
