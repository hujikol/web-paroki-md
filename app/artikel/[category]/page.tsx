import { Metadata } from "next";
import { getAllPosts } from "@/actions/posts";
import PostList from "@/components/blog/PostList";
import { BookOpen, Calendar, FileText, MessageSquare, Newspaper } from "lucide-react";
import { getMasterCategories } from "@/actions/master-categories";

export async function generateStaticParams() {
    const categories = await getMasterCategories();
    // Assuming category routes are lowercase/kebab-case of the names
    return categories.post.map((category) => ({ category }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category } = await params;
    // Fallback metadata since we don't have descriptions in the simple JSON list
    return {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} | Paroki Brayut`,
        description: `Artikel kategori ${category}`,
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const allPosts = await getAllPosts();
    const publishedPosts = allPosts.filter((post) => post.published);
    const masterCategories = await getMasterCategories();

    // Default icon
    const Icon = Newspaper;

    // Capitalize for display
    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div className="py-12">
            {/* Header */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">{displayCategory}</h1>
                            <p className="text-blue-100 mt-2">Daftar artikel kategori {displayCategory}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <PostList
                    initialPosts={publishedPosts}
                    defaultCategory={displayCategory}
                    categories={masterCategories.post}
                />
            </div>
        </div>
    );
}
