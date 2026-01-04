"use client";

import { ChurchStatistics } from "@/types/data";
import { Users, Home, MapPin, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatistikSectionProps {
    stats: ChurchStatistics | null;
}

export default function StatistikSection({ stats }: StatistikSectionProps) {
    if (!stats) return null;

    const statItems = [
        {
            label: "Umat",
            value: stats.parishioners.toLocaleString('id-ID'),
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Kepala Keluarga",
            value: stats.families.toLocaleString('id-ID'),
            icon: Heart,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
        {
            label: "Lingkungan",
            value: stats.wards.toLocaleString('id-ID'),
            icon: MapPin,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            label: "Gereja Wilayah",
            value: stats.churches.toLocaleString('id-ID'),
            icon: Home,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
    ];

    return (
        <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl opacity-30" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Statistik Umat
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                            Pertumbuhan komunitas iman kita dalam angka. Data diambil dari sistem BIDUK Paroki.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Terakhir diperbarui: {new Date(stats.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {statItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors border-none text-white">
                                <CardContent className="p-6 text-center">
                                    <div className={`mx-auto w-14 h-14 rounded-full ${item.bg} flex items-center justify-center mb-4`}>
                                        <item.icon className={`w-7 h-7 ${item.color}`} />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                                        {item.value}
                                    </div>
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                                        {item.label}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
