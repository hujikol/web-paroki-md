export interface PostFrontmatter {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  banner?: string;
  published: boolean;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: any; // Delta object or Markdown string
  rawContent: string;
}

export interface PostMetadata {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  banner?: string;
  published: boolean;
}
