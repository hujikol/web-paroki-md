import Link from "next/link";
import Image from "next/image";
import { PostMetadata } from "@/types/post";

interface PostCardProps {
  post: PostMetadata;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {post.banner && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.banner}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{post.author}</span>
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
