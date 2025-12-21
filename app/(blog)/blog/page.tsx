import { getAllPosts } from "@/actions/posts";
import PostCard from "@/components/blog/PostCard";

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    // Return empty state if GitHub is not configured
  }
  
  const publishedPosts = posts.filter((post) => post.published);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Explore our latest articles and insights
        </p>
      </div>

      {publishedPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No posts published yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
