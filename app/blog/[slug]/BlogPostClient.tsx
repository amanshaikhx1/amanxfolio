"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, User, Share2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

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

export default function BlogPostClient({ post }: { post: BlogPost }) {
  if (!post) {
    notFound()
  }

  // Convert markdown-like content to HTML
  const formatContent = (content: string) => {
    return (
      content
        // Convert headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-6 text-gray-900 dark:text-white">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-8 text-gray-900 dark:text-white">$1</h1>')

        // Convert bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')

        // Convert code blocks
        .replace(
          /```(\w+)?\n([\s\S]*?)```/g,
          '<pre class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-6 overflow-x-auto"><code class="text-sm text-gray-800 dark:text-gray-200">$2</code></pre>',
        )

        // Convert inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-800 dark:text-gray-200">$1</code>',
        )

        // Convert bullet points
        .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 text-gray-700 dark:text-gray-300">$1</li>')

        // Wrap consecutive list items in ul tags
        .replace(/(<li.*<\/li>\s*)+/g, '<ul class="list-disc my-4">$&</ul>')

        // Convert paragraphs
        .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">')
        .replace(/^(?!<[h|u|p|c])(.+)$/gim, '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">$1</p>')

        // Clean up extra paragraph tags
        .replace(/<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"><\/p>/g, "")
        .replace(/<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">(<[h|u])/g, "$1")
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Original Header */}
      <Header />

      <main className="pt-32 pb-20">
        <article className="container mx-auto px-5 max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-green-500" />
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-green-500" />
                {post.date.month} {post.date.day}, {post.date.year}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-green-500" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <Image
                src={post.authorImage || "/placeholder.svg?height=48&width=48"}
                alt={post.author}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-green-500"
              />
              <div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Published on {post.date.month} {post.date.day}, {post.date.year}
                </p>
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatContent(post.content),
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <Link href="/blog">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  All Posts
                </Button>
              </Link>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </article>
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
