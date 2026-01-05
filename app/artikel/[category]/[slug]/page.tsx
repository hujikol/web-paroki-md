import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/actions/posts";
import { calculateReadingTime } from "@/lib/utils";
import PostHeader from "@/components/blog/PostHeader";
import PostContent from "@/components/blog/PostContent";
import { PostCategory } from "@/types/post";

type Props = {
    params: Promise<{
        category: PostCategory;
        slug: string;
    }>;
};

export async function generateStaticParams() {
    const posts = await getAllPosts();

    // Generate a path for each tag on each post
    // This allows posts with multiple tags to be accessible from multiple category routes
    const paths: { category: string; slug: string }[] = [];

    posts.forEach((post) => {
        // If post has tags array, create a path for each tag
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
                paths.push({
                    category: tag.toLowerCase(),
                    slug: post.slug,
                });
            });
        }
        // Fallback to single category if available
        else if (post.category) {
            paths.push({
                category: post.category,
                slug: post.slug,
            });
        }
    });

    return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    const { frontmatter } = post;

    return {
        title: frontmatter.metaTitle || frontmatter.title,
        description: frontmatter.metaDescription || frontmatter.description,
        keywords: frontmatter.metaKeywords,
        openGraph: {
            title: frontmatter.metaTitle || frontmatter.title,
            description: frontmatter.metaDescription || frontmatter.description,
            url: `${process.env.NEXTAUTH_URL}/${category}/${slug}`,
            images: frontmatter.ogImage ? [frontmatter.ogImage] : frontmatter.banner ? [frontmatter.banner] : [],
            type: "article",
            publishedTime: frontmatter.publishedAt,
            modifiedTime: frontmatter.updatedAt,
            authors: [frontmatter.author],
            tags: frontmatter.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: frontmatter.metaTitle || frontmatter.title,
            description: frontmatter.metaDescription || frontmatter.description,
            images: frontmatter.ogImage ? [frontmatter.ogImage] : frontmatter.banner ? [frontmatter.banner] : [],
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { category, slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Verify the category matches one of the post's tags
    const postTags = post.frontmatter.tags?.map((tag: string) => tag.toLowerCase()) || [];
    const postCategory = post.frontmatter.category?.toLowerCase();

    // Check if the requested category matches either the tags or the single category
    const isValidCategory = postTags.includes(category.toLowerCase()) ||
        postCategory === category.toLowerCase();

    if (!isValidCategory) {
        notFound();
    }

    const readingTime = calculateReadingTime(post.content);

    return (
        <>
            <PostHeader frontmatter={post.frontmatter} readingTime={readingTime} />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Description Quote */}
                {post.frontmatter.description && (
                    <div className="mb-12 max-w-3xl mx-auto text-center">
                        <p className="text-xl md:text-2xl font-serif italic text-gray-500 leading-relaxed">
                            {post.frontmatter.description}
                        </p>
                        <div className="h-1 w-20 bg-brand-gold mx-auto mt-8 rounded-full opacity-40" />
                    </div>
                )}

                <PostContent content={post.content} />
            </article>
        </>
    );
}
