import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/actions/posts";
import { renderMarkdown } from "@/lib/content/renderer";
import PostHeader from "@/components/blog/PostHeader";
import PostContent from "@/components/blog/PostContent";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.frontmatter.published) {
    notFound();
  }

  const html = await renderMarkdown(post.content);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <PostHeader frontmatter={post.frontmatter} />
      <PostContent html={html} />
    </article>
  );
}
