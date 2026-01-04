"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-dark text-white">
            {/* Background Gradient/Image Placeholder */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-brand-dark z-10" />
                {/* You can replace this with an actual image or video background */}
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1548625361-8889aa360a08?q=80&w=2070&auto=format&fit=crop')",
                        filter: "brightness(0.5)"
                    }}
                />
            </div>

            <div className="relative z-20 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-6"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-4"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                        Selamat Datang di Website Resmi
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                        Paroki Brayut <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">
                            Santo Yohanes Paulus II
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        Membangun iman, persaudaraan, dan kasih dalam semangat Kristus. Bergabunglah bersama kami dalam perayaan Ekaristi dan kegiatan umat.
                    </p>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <Button size="lg" className="h-12 px-8 text-base bg-brand-gold hover:bg-yellow-600 text-brand-dark font-semibold rounded-full w-full sm:w-auto" asChild>
                            <Link href="/jadwal-misa">
                                <Calendar className="mr-2 h-5 w-5" />
                                Jadwal Misa
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm rounded-full w-full sm:w-auto" asChild>
                            <Link href="/profil">
                                Tentang Kami
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Quick Info Pills */}
                    <div className="pt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm">
                            <MapPin className="h-4 w-4 text-brand-gold" />
                            Brayut, Pandowoharjo, Sleman
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm">
                            <Calendar className="h-4 w-4 text-brand-gold" />
                            Misa Harian & Mingguan
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-white/50 rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
