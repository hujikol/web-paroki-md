# SEO Implementation Guide

This project uses Next.js Metadata API for Search Engine Optimization.

## Static Pages

For static pages (pages that don't change based on parameters), export a `metadata` object from the `page.tsx` file.

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Title | Paroki Brayut",
    description: "Detailed description of the page content.",
    openGraph: {
        title: "Page Title | Paroki Brayut",
        description: "Detailed description of the page content.",
        type: "website",
    }
};

export default function Page() {
    // ...
}
```

## Dynamic Pages (Blog Posts)

For dynamic pages like blog posts, use `generateMetadata` function.

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    
    // Fallback if post not found
    if (!post) return { title: "Not Found" };

    return {
        title: post.frontmatter.metaTitle || post.frontmatter.title,
        description: post.frontmatter.metaDescription || post.frontmatter.description,
        openGraph: {
            title: post.frontmatter.metaTitle || post.frontmatter.title,
            description: post.frontmatter.metaDescription || post.frontmatter.description,
            images: post.frontmatter.ogImage ? [post.frontmatter.ogImage] : [],
            type: "article",
        }
    };
}
```

## Admin Interaction

### Blog Posts
When creating or editing a post in the Admin Panel (`/admin/posts`), there is a dedicated "SEO Settings" section.
- **Meta Title**: Overrides the default post title in search results.
- **Meta Description**: Overrides the default description.
- **Meta Keywords**: Adding keywords for search engines (though less important nowadays).
- **Open Graph Image**: Specific image for social media sharing. If left empty, the post banner is used.

### Static Pages
Static page metadata is hardcoded in the code. To update it, a developer must modify the `page.tsx` file.

## Best Practices

1. **Title**: Keep it under 60 characters. Format: `Page Name | Site Name`.
2. **Description**: Keep it between 150-160 characters. Make it compelling as it appears in search results.
3. **Images**: Use high-quality images for Open Graph. Recommended size: 1200x630 pixels.
