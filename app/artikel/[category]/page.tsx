import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/actions/posts";
import PostCard from "@/components/blog/PostCard";
import { BookOpen, Calendar, FileText, MessageSquare, Newspaper } from "lucide-react";
import { PostCategory } from "@/types/post";

const categoryInfo: Record<PostCategory, { title: string; description: string; icon: any }> = {
    "berita": {
        title: "Berita",
        description: "Berita dan informasi terkini paroki",
        icon: FileText,
    },
    "event": {
        title: "Event",
        description: "Acara dan kegiatan mendatang",
        icon: Calendar,
    },
    "gereja": {
        title: "Gereja",
        description: "Artikel seputar kehidupan gereja",
        icon: BookOpen,
    },
    "kegiatan": {
        title: "Kegiatan",
        description: "Laporan dan dokumentasi kegiatan paroki",
        icon: Calendar,
    },
    "wacana": {
        title: "Wacana",
        description: "Diskusi dan wacana rohani",
        icon: MessageSquare,
    },
    "warta-paroki": {
        title: "Warta Paroki",
        description: "Warta dan pengumuman paroki",
        icon: FileText,
    },
    "bacaan-harian": {
        title: "Bacaan Harian",
        description: "Bacaan liturgi harian",
        icon: BookOpen,
    },
    "renungan": {
        title: "Renungan",
        description: "Renungan rohani",
        icon: MessageSquare,
    },
    "umum": {
        title: "Umum",
        description: "Informasi umum",
        icon: Newspaper,
    },
};

export async function generateStaticParams() {
    const categories: PostCategory[] = [
        "berita", "event", "gereja", "kegiatan", "wacana", "warta-paroki",
        "bacaan-harian", "renungan", "umum"
    ];
    return categories.map((category) => ({ category }));
}

// ... imports

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: PostCategory }>;
}): Promise<Metadata> {
    const { category } = await params;
    const info = categoryInfo[category];
    return {
        title: `${info.title} | Paroki Brayut`,
        description: info.description,
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: PostCategory }>;
}) {
    const { category } = await params;
    const allPosts = await getAllPosts();
    // Filter posts that have this category in their tags array (case-insensitive)
    const categoryPosts = allPosts.filter((post) => {
        if (!post.published) return false;
        // Convert category param to title case for matching
        const categoryTitle = category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return post.tags?.some(tag => tag.toLowerCase() === category.toLowerCase().replace(/-/g, ' '));
    });

    const info = categoryInfo[category];
    const Icon = info.icon;

    return (
        <div className="py-12">
            {/* Header */}
            <section className="bg-gradient-to-r from-brand-blue to-brand-darkBlue text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon className="h-10 w-10" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">{info.title}</h1>
                            <p className="text-blue-100 mt-2">{info.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filter */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Kategori
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(categoryInfo).map(([key, value]) => (
                            <Link
                                key={key}
                                href={`/artikel/${key}`}
                                className={`px-6 py-2.5 rounded-full font-medium transition-colors ${category === key
                                    ? "bg-brand-blue text-white shadow-md"
                                    : "bg-white border border-gray-300 text-gray-700 hover:border-brand-blue hover:text-brand-blue"
                                    }`}
                            >
                                {value.title}
                            </Link>
                        ))}
                        <Link
                            href="/artikel"
                            className="px-6 py-2.5 rounded-full font-medium bg-white border border-gray-300 text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-colors"
                        >
                            Semua Artikel
                        </Link>
                    </div>
                </div>

                {/* Posts Grid */}
                {categoryPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            Belum Ada Artikel
                        </h3>
                        <p className="text-gray-500">
                            Belum ada artikel dalam kategori {info.title.toLowerCase()}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
