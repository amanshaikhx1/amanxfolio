import { notFound } from "next/navigation"
import { getBlogPost } from "./getBlogPost"
import BlogPostClient from "./BlogPostClient"

// Add this function right after the imports and before the main component
export async function generateStaticParams() {
  // Define all the blog slugs that should be statically generated
  const blogSlugs = [
    "ui-ux-design-principles",
    "introduction-to-artificial-intelligence",
    "junior-to-senior-developer-roadmap",
    "react-server-components",
    "website-performance-optimization",
    "building-accessible-web-applications",
    "future-web-development-trends", // Added this missing slug
    "javascript-best-practices",
    "css-grid-vs-flexbox",
    "modern-frontend-frameworks",
  ]

  return blogSlugs.map((slug) => ({
    slug: slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} />
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  }
}
