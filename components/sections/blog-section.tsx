"use client";

import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/lib/supabase"; // ensure correct path

import { useEffect, useState } from "react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  image: string;
  publishedAt: string;
};

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, image, publishedAt")
        .order("publishedAt", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data || []);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              My Blog
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent relative inline-block after:content-[''] after:block after:mt-2 after:w-20 after:h-1 after:bg-green-500 after:mx-auto">
            Latest Articles
          </h2>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {blogs.map((post) => (
            <article
              key={post.id}
              className="rounded-lg overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-700/50 h-full flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 350px"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-green-500 transition-colors bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent hover:from-green-500 hover:to-green-400"
                  >
                    {post.title}
                  </Link>
                </h3>

                {/* Author & Read More */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
                  <div className="flex items-center">
                    <Image
                      src="/aman.jpg"
                      alt="Aman Shaikh"
                      width={30}
                      height={30}
                      className="w-7 h-7 rounded-full border-2 border-green-500 mr-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <User className="h-3 w-3 mr-1 text-green-500" />
                      Aman Shaikh
                    </span>
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

        {/* View All */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
