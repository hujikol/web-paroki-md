import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/actions/posts";
import PostCard from "@/components/blog/PostCard";
import { PostCategory } from "@/types/post";
import { BookOpen, Calendar, FileText, MessageSquare, Newspaper } from "lucide-react";

export const metadata: Metadata = {
    title: "Artikel | Paroki Brayut",
    description: "Artikel, berita, dan informasi dari Paroki Brayut Santo Yohanes Paulus II",
};

const categoryInfo: Record<PostCategory, { title: string; description: string; icon: any; color: string }> = {
    "berita": {
        title: "Berita",
        description: "Berita dan informasi terkini paroki",
        icon: FileText,
        color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    "event": {
        title: "Event",
        description: "Acara dan kegiatan mendatang",
        icon: Calendar,
        color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    "gereja": {
        title: "Gereja",
        description: "Artikel seputar kehidupan gereja",
        icon: BookOpen,
        color: "bg-green-100 text-green-700 border-green-200",
    },
    "wacana": {
        title: "Wacana",
        description: "Diskusi dan wacana rohani",
        icon: MessageSquare,
        color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    "bacaan-harian": {
        title: "Bacaan Harian",
        description: "Bacaan liturgi harian",
        icon: BookOpen,
        color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    "renungan": {
        title: "Renungan",
        description: "Renungan rohani",
        icon: MessageSquare,
        color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    "warta-paroki": {
        title: "Warta Paroki",
        description: "Berita paroki",
        icon: FileText,
        color: "bg-green-100 text-green-700 border-green-200",
    },
    "kegiatan": {
        title: "Kegiatan",
        description: "Dokumentasi kegiatan",
        icon: Calendar,
        color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    "umum": {
        title: "Umum",
        description: "Informasi umum",
        icon: Newspaper,
        color: "bg-gray-100 text-gray-700 border-gray-200",
    },
};

export default async function ArtikelPage() {
    const allPosts = await getAllPosts();
    const publishedPosts = allPosts.filter((post) => post.published);

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Category Cards */}
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Kategori</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(categoryInfo).map(([key, value]) => {
                            const Icon = value.icon;
                            const count = publishedPosts.filter((p) => p.category === key).length;

                            return (
                                <Link
                                    key={key}
                                    href={`/artikel/${key}`}
                                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-blue hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`rounded-lg p-3 ${value.color.split(' ')[0]}`}>
                                            <Icon className={`h-6 w-6 ${value.color.split(' ')[1]}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-brand-dark text-lg mb-1">
                                                {value.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">{value.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{count} artikel</span>
                                        <span className="text-brand-blue font-medium">
                                            Lihat semua →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Latest Posts */}
                <section>
                    <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-bold text-brand-dark">Artikel Terbaru</h2>
                        <div className="flex gap-2">
                            {Object.entries(categoryInfo).map(([key, value]) => (
                                <Link
                                    key={key}
                                    href={`/artikel/${key}`}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${value.color}`}
                                >
                                    {value.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {publishedPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {publishedPosts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                Belum Ada Artikel
                            </h3>
                            <p className="text-gray-500">
                                Artikel akan segera ditambahkan. Stay tuned!
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
