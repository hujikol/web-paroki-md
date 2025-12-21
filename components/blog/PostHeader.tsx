import Image from "next/image";
import { PostFrontmatter } from "@/types/post";

interface PostHeaderProps {
  frontmatter: PostFrontmatter;
}

export default function PostHeader({ frontmatter }: PostHeaderProps) {
  const formattedDate = new Date(frontmatter.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-8">
      {frontmatter.banner && (
        <div className="relative h-96 w-full mb-8 rounded-2xl overflow-hidden">
          <Image
            src={frontmatter.banner}
            alt={frontmatter.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {frontmatter.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {frontmatter.title}
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        {frontmatter.description}
      </p>
      
      <div className="flex items-center text-gray-500 dark:text-gray-400">
        <span className="font-medium">{frontmatter.author}</span>
        <span className="mx-2">•</span>
        <time dateTime={frontmatter.publishedAt}>{formattedDate}</time>
        {frontmatter.updatedAt && (
          <>
            <span className="mx-2">•</span>
            <span className="text-sm">Updated {new Date(frontmatter.updatedAt).toLocaleDateString()}</span>
          </>
        )}
      </div>
    </header>
  );
}
