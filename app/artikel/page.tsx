import { Metadata } from "next";
import { getAllPosts } from "@/actions/posts";
import PostList from "@/components/blog/PostList";
import { Newspaper } from "lucide-react";
import { getMasterCategories } from "@/actions/master-categories";

export const metadata: Metadata = {
    title: "Artikel | Paroki Brayut",
    description: "Artikel, berita, dan informasi dari Paroki Brayut Santo Yohanes Paulus II",
};

export default async function ArtikelPage() {
    const allPosts = await getAllPosts();
    const publishedPosts = allPosts.filter((post) => post.published);
    const categories = await getMasterCategories();

    return (
        <div className="py-12">
            {/* Header */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Newspaper className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Artikel & Berita</h1>
                            <p className="text-blue-100 mt-2">
                                Bacaan, renungan, warta, dan informasi paroki
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <PostList initialPosts={publishedPosts} categories={categories.post} />
            </div>
        </div>
    );
}
