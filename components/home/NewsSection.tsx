"use client";

import { PostMetadata } from "@/types/post";
import PostCard from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewsSectionProps {
    posts: PostMetadata[];
}

export default function NewsSection({ posts }: NewsSectionProps) {
    // Only show first 3 posts
    const recentPosts = posts.slice(0, 3);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="bg-blue-100 text-brand-blue px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
                        Warta Paroki
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Berita & Renungan Terbaru
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Ikuti perkembangan terkini, renungan harian, dan cerita inspiratif dari komunitas kami.
                    </p>
                </div>

                {recentPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {recentPosts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mb-12">
                        <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">Belum ada berita yang diterbitkan.</p>
                    </div>
                )}

                <div className="flex justify-center">
                    <Button size="lg" className="rounded-full px-8 bg-brand-dark text-white hover:bg-gray-800" asChild>
                        <Link href="/artikel">
                            Baca Semua Berita
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
