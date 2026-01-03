export type PostCategory = "berita" | "event" | "gereja" | "kegiatan" | "wacana" | "warta-paroki";

export interface PostFrontmatter {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: PostCategory;
  banner?: string;
  published: boolean;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
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
  category: PostCategory;
  banner?: string;
  published: boolean;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
}
