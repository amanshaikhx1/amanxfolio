"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { supabase } from "@/app/lib/supabase" // centralized supabase
import { AUTHOR } from "@/app/config/author"  // centralized author

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  tags?: string[]
  date: {
    day: string
    month: string
    year: string
  }
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

  // Hydration-safe loading: client-only
  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async (page = 1, search = "") => {
    setLoading(true)
    const limit = 6
    const offset = (page - 1) * limit

    let query = supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .order("publishedAt", { ascending: false })
      .range(offset, offset + limit - 1)

    if (search.trim()) query = query.ilike("title", `%${search}%`)

    const { data, count, error } = await query

    if (error) console.error(error)
    else {
      const formattedData = (data || []).map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        image: post.image,
        tags: post.tags ? post.tags.split(",").map((t: string) => t.trim()) : [],
        date: {
          day: new Date(post.publishedAt).getDate().toString().padStart(2, "0"),
          month: new Date(post.publishedAt).toLocaleString("default", { month: "long" }),
          year: new Date(post.publishedAt).getFullYear().toString(),
        },
      }))

      setBlogPosts(formattedData)
      setPagination({
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      })
    }

    setLoading(false)
  }

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
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-5">
          {/* Page Title */}
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-500 dark:text-green-500">
                My Blog
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-20 after:h-1 after:bg-green-500 after:mx-auto">
              Latest Articles
            </h2>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-10">
            <div className="w-full mb-8">
              <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  {searchTerm && (
                    <button type="button" onClick={clearSearch} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      Clear
                    </button>
                  )}
                  <button type="submit" className="p-1">
                    <Search className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </form>
            </div>

            {/* Blog Cards */}
            {loading ? (
              <div className="grid grid-cols-1 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-60 rounded-xl" />
                ))}
              </div>
            ) : blogPosts.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">No articles found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative h-60 md:h-auto">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="md:w-3/5 p-6 flex flex-col">
                      <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1 text-green-500" />
                        <span>{post.date.month} {post.date.day}, {post.date.year}</span>
                      </div>


                      <h2 className="text-xl md:text-2xl font-semibold mb-3 line-clamp-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        <Link href={`/blog/${post.slug}`} className="hover:text-green-500 transition-colors hover:from-green-500 hover:to-green-400">
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>

                      {/* Author */}
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center">
                          <Image
                            src={AUTHOR.image}
                            alt={AUTHOR.name}
                            width={30}
                            height={30}
                            className="w-7 h-7 rounded-full border-2 border-green-500 mr-2"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{AUTHOR.name}</span>
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
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                {pagination.page > 1 && (
                  <button onClick={() => handlePageChange(pagination.page - 1)} className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:bg-green-500 hover:text-white">←</button>
                )}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded ${page === pagination.page ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"}`}>{page}</button>
                ))}
                {pagination.page < pagination.totalPages && (
                  <button onClick={() => handlePageChange(pagination.page + 1)} className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:bg-green-500 hover:text-white">→</button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

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
