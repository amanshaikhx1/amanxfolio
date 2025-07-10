import { notFound } from "next/navigation";
import { getBlogPost } from "./getBlogPost";
import BlogPostClient from "./BlogPostClient";

/* Static Params for SSG */
export async function generateStaticParams() {
  const blogSlugs = [
    "user-stories-business-data-analysts",
    "how-tableau-helps-business-data-analysis",
    "data-cleaning-tips-for-analysts",
    "business-data-analysts-ecommerce-growth-india",
    "data-visualization-for-business-analysts",
    "real-time-dashboards-for-business-analysts",
    "stakeholder-collaboration-in-business-data-analysis",
    "data-analyst-product-development-insights",
    "css-grid-vs-flexbox",
    "modern-frontend-frameworks",
  ];

  return blogSlugs.map((slug) => ({ slug }));
}

/* Fix #1: DO NOT destructure params directly */
export default async function BlogPostPage(props: {
  params: { slug: string };
}) {
  const { params } = props;
  const post = await getBlogPost(params.slug);

  if (!post) notFound();

  return <BlogPostClient post={post} />;
}

/* Fix #2: generateMetadata with same pattern */
export async function generateMetadata(props: {
  params: { slug: string };
}) {
  const { params } = props;
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}
