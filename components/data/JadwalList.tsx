"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { ScheduleEvent } from "@/types/data";
import { SCHEDULE_CATEGORY_COLORS } from "@/lib/constants";

export default function JadwalList({ initialEvents, categories }: { initialEvents: ScheduleEvent[], categories: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [showMonthFilter, setShowMonthFilter] = useState(true);

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Filter Logic
    const filteredEvents = useMemo(() => {
        return initialEvents.filter((event) => {
            const eventDate = new Date(event.date);

            // Category Filter
            if (selectedCategory !== "all" && event.category !== selectedCategory) {
                return false;
            }

            // Month Filter (if active)
            if (showMonthFilter) {
                if (eventDate.getMonth() !== selectedMonth.getMonth() || eventDate.getFullYear() !== selectedMonth.getFullYear()) {
                    return false;
                }
            }

            return true;
        });
    }, [initialEvents, selectedCategory, selectedMonth, showMonthFilter]);

    const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col gap-6">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === "all"
                            ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue/30"
                            }`}
                    >
                        Semua
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === category
                                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue/30"
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Month Filter Control */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                        <Filter className="h-5 w-5 text-brand-blue" />
                        <span>Filter Bulan</span>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button
                            onClick={() => {
                                const newDate = new Date(selectedMonth);
                                newDate.setMonth(newDate.getMonth() - 1);
                                setSelectedMonth(newDate);
                            }}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 hover:text-brand-blue"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="min-w-[140px] text-center font-bold text-gray-800">
                            {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                        </div>
                        <button
                            onClick={() => {
                                const newDate = new Date(selectedMonth);
                                newDate.setMonth(newDate.getMonth() + 1);
                                setSelectedMonth(newDate);
                            }}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 hover:text-brand-blue"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setSelectedMonth(new Date())}
                        className="text-xs font-bold text-brand-blue hover:underline"
                    >
                        Reset to This Month
                    </button>
                </div>
            </div>

            {/* Events List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark">
                        Kegiatan {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                    </h2>
                    <span className="text-sm font-bold bg-brand-cream text-brand-blue px-3 py-1 rounded-full border border-brand-blue/10">
                        {sortedEvents.length} Kegiatan
                    </span>
                </div>

                <div className="space-y-4">
                    {sortedEvents.length > 0 ? (
                        sortedEvents.map((activity) => {
                            const isPast = new Date(activity.date) < currentDate;
                            return (
                                <div
                                    key={activity.id}
                                    className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${isPast ? "border-gray-100 opacity-75 grayscale-[0.5] hover:opacity-100 hover:grayscale-0" : "border-gray-200 hover:border-brand-blue hover:shadow-lg"
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Date Box */}
                                        <div className="flex-shrink-0">
                                            <div className={`rounded-lg p-4 text-center w-20 ${isPast ? "bg-gray-100 text-gray-500" : "bg-brand-blue text-white"
                                                }`}>
                                                <div className="text-2xl font-bold">
                                                    {new Date(activity.date).getDate()}
                                                </div>
                                                <div className="text-sm">
                                                    {new Date(activity.date).toLocaleDateString('id-ID', { month: 'short' })}
                                                </div>
                                                <div className="text-xs opacity-80">
                                                    {new Date(activity.date).getFullYear()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <h3 className={`text-xl font-bold ${isPast ? "text-gray-700" : "text-brand-dark"}`}>
                                                        {activity.title}
                                                    </h3>
                                                    {isPast && (
                                                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                            Telah Berlalu
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${SCHEDULE_CATEGORY_COLORS[activity.category.toLowerCase()] || SCHEDULE_CATEGORY_COLORS.lainnya
                                                        }`}
                                                >
                                                    {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{activity.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Clock className={`h-4 w-4 ${isPast ? "text-gray-400" : "text-brand-blue"}`} />
                                                    <span>
                                                        {new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                        {activity.time ? `, ${activity.time}` : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className={`h-4 w-4 ${isPast ? "text-gray-400" : "text-brand-blue"}`} />
                                                    <span>{activity.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Tidak ada kegiatan di bulan ini.</p>
                            {selectedCategory !== 'all' && (
                                <p className="text-sm text-gray-400 mt-2">Coba ubah filter kategori atau pilih bulan lain.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
