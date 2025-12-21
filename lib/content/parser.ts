import matter from "gray-matter";
import { Post, PostFrontmatter } from "@/types/post";

export function parseMarkdown(content: string): Post {
  const { data, content: markdownContent } = matter(content);

  return {
    frontmatter: data as PostFrontmatter,
    content: markdownContent,
    rawContent: content,
  };
}

export function stringifyMarkdown(frontmatter: PostFrontmatter, content: string): string {
  return matter.stringify(content, frontmatter);
}
