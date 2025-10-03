"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, Printer, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { supabase } from "@/app/lib/supabase";
import { AUTHOR } from "@/app/config/author";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BlogPost = {
  title: string;
  slug: string;
  content: string;
  image: string;
  tags: string[];
  date: {
    day: string;
    month: string;
    year: string;
  };
};

export default function BlogPostClient() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("title, content, image, tags, publishedAt, slug")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      const formattedData: BlogPost = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()) : [],
        date: {
          day: new Date(data.publishedAt).getDate().toString().padStart(2, "0"),
          month: new Date(data.publishedAt).toLocaleString("default", { month: "long" }),
          year: new Date(data.publishedAt).getFullYear().toString(),
        },
      };

      setPost(formattedData);
      setLoading(false);
    };

    if (slug) fetchPost();
  }, [slug]);

  // 🟢 Skeleton Loader (same feel as Blog List)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-5 max-w-4xl animate-pulse">
            {/* Title Skeleton */}
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-6"></div>
            
            {/* Author Skeleton */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
              </div>
            </div>

            {/* Image Skeleton */}
            <div className="w-full h-72 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8"></div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return <p className="text-center py-20">Post not found</p>;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.slice(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="pt-32 pb-20">
        <article className="container mx-auto px-5 max-w-4xl">
          {/* Back to Blog */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>

          {/* Blog Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Author + Date */}
            <div className="flex items-center gap-3 mb-8">
              <Image
                src={AUTHOR.image}
                alt={AUTHOR.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-green-500"
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{AUTHOR.name}</span>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Calendar className="h-4 w-4 text-green-500 mr-1" />
                  {post.date.month} {post.date.day}, {post.date.year}
                </div>
              </div>
            </div>

            {/* Blog Image */}
            {post.image && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
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

          {/* Bottom Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" /> All Posts
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 z-50"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
