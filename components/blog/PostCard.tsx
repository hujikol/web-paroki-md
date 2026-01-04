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

  // Use the post category for the URL, fallback to 'umum'
  const categorySlug = post.category || "umum";

  return (
    <Link href={`/artikel/${categorySlug}/${post.slug}`} className="group block h-full">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col">
        {post.banner && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.banner}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-brand-cream text-brand-blue text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-3 text-brand-dark group-hover:text-brand-blue transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {post.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
            <span className="font-medium text-brand-dark">{post.author}</span>
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
