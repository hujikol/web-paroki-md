"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { ScheduleEvent } from "@/types/data";
import { SCHEDULE_CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function JadwalList({ initialEvents, categories }: { initialEvents: ScheduleEvent[], categories: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const currentDate = new Date();
    // Reset hours to compare dates only
    currentDate.setHours(0, 0, 0, 0);

    // Calculate Category Counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { "all": 0 };
        categories.forEach(cat => counts[cat] = 0);

        initialEvents.forEach(event => {
            const eventDate = new Date(event.date);
            // Count based on current selected month? 
            // Usually counts are global or filtered. 
            // Requirements say "like in data umkm", which calculated based on current view usually or global.
            // Let's count GLOBAL for simplicity or filtered? 
            // UMKM was global count. Let's do global.
            counts["all"]++;
            if (counts[event.category] !== undefined) {
                counts[event.category]++;
            }
        });
        return counts;
    }, [initialEvents, categories]);

    // Filter Logic
    const filteredEvents = useMemo(() => {
        return initialEvents.filter((event) => {
            const eventDate = new Date(event.date);

            // Category Filter
            if (selectedCategory !== "all" && event.category !== selectedCategory) {
                return false;
            }

            // Month Filter
            if (eventDate.getMonth() !== selectedMonth.getMonth() || eventDate.getFullYear() !== selectedMonth.getFullYear()) {
                return false;
            }

            return true;
        });
    }, [initialEvents, selectedCategory, selectedMonth]);

    const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">

                {/* Month Filter - Simple & Modern */}
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm w-fit">
                    <button
                        onClick={() => {
                            const newDate = new Date(selectedMonth);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setSelectedMonth(newDate);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-brand-blue"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="px-2 text-center">
                        <span className="block text-sm font-bold text-gray-900 leading-tight">
                            {months[selectedMonth.getMonth()]}
                        </span>
                        <span className="block text-xs text-brand-blue font-medium">
                            {selectedMonth.getFullYear()}
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            const newDate = new Date(selectedMonth);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setSelectedMonth(newDate);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-brand-blue"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Category Filter - Scrollable & Small */}
                <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide gap-2">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 border ${selectedCategory === "all"
                            ? "bg-brand-blue text-white border-brand-blue"
                            : "bg-white border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue"
                            }`}
                    >
                        All
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                            {categoryCounts["all"]}
                        </span>
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 border ${selectedCategory === category
                                ? "bg-brand-blue text-white border-brand-blue"
                                : "bg-white border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue"
                                }`}
                        >
                            {category}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === category ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {categoryCounts[category] || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <section>
                {sortedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedEvents.map((activity) => {
                            const isPast = new Date(activity.date) < currentDate;
                            const hasImage = !!activity.imageUrl;

                            return (
                                <div
                                    key={activity.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-lg hover:border-brand-blue/30 transition-all duration-300 group"
                                >
                                    {/* Image / Gradient Header */}
                                    <div className={`h-48 relative overflow-hidden ${hasImage ? "bg-gray-100" : "bg-gradient-to-br from-brand-blue/5 to-purple-50"}`}>
                                        {hasImage ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={activity.imageUrl}
                                                alt={activity.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                                <Calendar className="h-24 w-24 text-brand-blue" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 z-10">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${SCHEDULE_CATEGORY_COLORS[activity.category.toLowerCase()] || "bg-white text-gray-700"} `}>
                                                {activity.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="text-xs text-brand-blue font-bold tracking-wide uppercase bg-brand-blue/5 px-2 py-1 rounded-md">
                                                {new Date(activity.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                            {isPast && (
                                                <span className="text-[10px] font-bold text-red-500 border border-red-200 bg-red-50 px-2 py-1 rounded uppercase">
                                                    Selesai
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-brand-dark mb-3 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                                            {activity.title}
                                        </h3>

                                        <div className="space-y-2 mb-6 text-sm text-gray-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-brand-blue/60 flex-shrink-0" />
                                                <span>
                                                    {activity.time ? activity.time : 'Waktu belum ditentukan'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-brand-blue/60 flex-shrink-0" />
                                                <span className="line-clamp-1">{activity.location}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            {activity.linkUrl ? (
                                                <a
                                                    href={activity.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-dark text-white font-semibold py-2.5 rounded-lg hover:bg-brand-blue transition-all group-hover:shadow-md"
                                                >
                                                    Detail Event <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 mb-1">Belum ada event</h3>
                        <p className="text-gray-500 text-sm">Tidak ada kegiatan di bulan {months[selectedMonth.getMonth()]}.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
