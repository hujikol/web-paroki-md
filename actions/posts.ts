"use server";

import { revalidatePath } from "next/cache";
import { getFile, listFiles, commitFiles, deleteFile } from "@/lib/github/operations";
import { parseMarkdown, stringifyMarkdown } from "@/lib/content/parser";
import { validateFrontmatter, generateSlug } from "@/lib/content/validator";
import { PostMetadata, PostFrontmatter } from "@/types/post";

export async function getAllPosts(): Promise<PostMetadata[]> {
  const files = await listFiles("posts");
  const posts: PostMetadata[] = [];

  for (const item of files) {
    if (!item.path.endsWith(".md")) continue;

    const content = await getFile(item.path);
    if (!content) continue;

    try {
      const { frontmatter } = parseMarkdown(content);
      posts.push(frontmatter);
    } catch (error) {
      console.error(`Error parsing ${item.path}:`, error);
    }
  }

  // Sort by published date, newest first
  return posts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPostBySlug(slug: string) {
  const files = await listFiles("posts");
  const item = files.find((file) => file.path.includes(slug) && file.path.endsWith(".md"));

  if (!item) {
    return null;
  }

  const content = await getFile(item.path);
  if (!content) {
    return null;
  }

  return parseMarkdown(content);
}

export async function createPost(formData: {
  title: string;
  description: string;
  author: string;
  tags: string[];
  content: string;
  banner?: string;
  published?: boolean;
}) {
  try {
    const slug = generateSlug(formData.title);
    const now = new Date().toISOString();

    const frontmatter: PostFrontmatter = {
      title: formData.title,
      slug,
      description: formData.description || "",
      publishedAt: now,
      author: formData.author,
      tags: formData.tags,
      banner: formData.banner,
      published: formData.published || false,
    };

    // Validate frontmatter
    validateFrontmatter(frontmatter);

    // Create markdown file
    const markdown = stringifyMarkdown(frontmatter, formData.content);
    const date = now.split("T")[0];
    const filename = `posts/${date}-${slug}.md`;

    // Commit to GitHub
    await commitFiles(
      [{ path: filename, content: markdown }],
      `Add post: ${formData.title}`
    );

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath(`/posts/${slug}`);

    return { success: true, slug };
  } catch (error: any) {
    console.error("Error creating post:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(
  slug: string,
  formData: {
    title: string;
    description: string;
    author: string;
    tags: string[];
    content: string;
    banner?: string;
    published?: boolean;
  }
) {
  try {
    // Find existing post
    const posts = await listFiles("posts");
    const item = posts.find((file) => file.path.includes(slug) && file.path.endsWith(".md"));

    if (!item) {
      return { success: false, error: "Post not found" };
    }

    const existingContent = await getFile(item.path);
    if (!existingContent) {
      return { success: false, error: "Post content not found" };
    }

    const { frontmatter: existingFrontmatter } = parseMarkdown(existingContent);

    const updatedFrontmatter: PostFrontmatter = {
      ...existingFrontmatter,
      title: formData.title,
      description: formData.description,
      author: formData.author,
      tags: formData.tags,
      banner: formData.banner,
      published: formData.published || false,
      updatedAt: new Date().toISOString(),
    };

    // Validate frontmatter
    validateFrontmatter(updatedFrontmatter);

    // Create updated markdown
    const markdown = stringifyMarkdown(updatedFrontmatter, formData.content);

    // Commit to GitHub
    await commitFiles(
      [{ path: item.path, content: markdown }],
      `Update post: ${formData.title}`
    );

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath(`/posts/${slug}`);

    return { success: true, slug };
  } catch (error: any) {
    console.error("Error updating post:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePost(slug: string) {
  try {
    const files = await listFiles("posts");
    const item = files.find((file) => file.path.includes(slug) && file.path.endsWith(".md"));

    if (!item) {
      return { success: false, error: "Post not found" };
    }

    await deleteFile(item.path, `Delete post: ${slug}`);

    // Revalidate paths
    revalidatePath("/blog");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message };
  }
}

export async function publishPost(slug: string) {
  try {
    const files = await listFiles("posts");
    const item = files.find((file) => file.path.includes(slug) && file.path.endsWith(".md"));

    if (!item) {
      return { success: false, error: "Post not found" };
    }

    const content = await getFile(item.path);
    if (!content) {
      return { success: false, error: "Post content not found" };
    }

    const { frontmatter, content: markdownContent } = parseMarkdown(content);
    frontmatter.published = true;
    frontmatter.updatedAt = new Date().toISOString();

    const markdown = stringifyMarkdown(frontmatter, markdownContent);

    await commitFiles(
      [{ path: item.path, content: markdown }],
      `Publish post: ${frontmatter.title}`
    );

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath(`/posts/${slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error publishing post:", error);
    return { success: false, error: error.message };
  }
}
