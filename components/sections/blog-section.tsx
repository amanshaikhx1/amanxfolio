
"use client";

import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const blogData = [
  {
    id: "1",
    title: "Understanding the Role of User Stories in Business Data Analytics",
    slug: "user-stories-business-data-analysts",
    author: "Aman Shaikh",
    authorImage: "/aman.jpg",
    image: "/blog img/1 blog.jpg",
  },
  {
    id: "2",
    title: "How Tableau Transforms Business Data into Actionable Insights",
    slug: "how-tableau-helps-business-data-analysis",
    author: "Aman Shaikh",
    authorImage: "/aman.jpg",
    image: "/blog img/2 blog.jpg",
  },
  {
    id: "3",
    title: "The Role of Data Cleaning in Effective Business Data Analysis",
    slug: "data-cleaning-tips-for-analysts",
    author: "Aman Shaikh",
    authorImage: "/aman.jpg",
    image: "/blog img/3 blog.jpg",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-950">
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


        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {blogData.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="rounded-lg overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-700/50 h-full flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 350px"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3 text-sm">
                  {/* <span className="text-green-500 font-medium relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:bg-green-500 before:rounded-full">
                    {post.category}
                  </span> */}
                </div>

                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-green-500 transition-colors bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent hover:from-green-500 hover:to-green-400"
                  >
                    {post.title}
                  </Link>
                </h3>

                {/* Author section */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
                  <div className="flex items-center">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      width={30}
                      height={30}
                      className="w-7 h-7 rounded-full border-2 border-green-500 mr-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <User className="h-3 w-3 mr-1 text-green-500" />
                      {post.author}
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

        {/* View all button */}
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
