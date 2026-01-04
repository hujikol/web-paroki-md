"use client";

import { useState, useMemo } from "react";
import { Store, Phone, MapPin, Info, Search } from "lucide-react";
import { UMKM } from "@/types/data";
import { UMKM_CATEGORIES } from "@/lib/constants";

interface UMKMListProps {
    initialUMKM: UMKM[];
    categories: string[];
}

export default function UMKMList({ initialUMKM, categories }: UMKMListProps) {
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    // Calculate counts for categories
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { "Semua": initialUMKM.length };

        // Initialize standard categories
        categories.forEach(cat => counts[cat] = 0);

        // Count items
        initialUMKM.forEach(umkm => {
            if (counts[umkm.type] !== undefined) {
                counts[umkm.type]++;
            } else {
                // Handle unknown categories if any
                if (!counts["Lainnya"]) counts["Lainnya"] = 0;
                counts["Lainnya"]++;
            }
        });

        return counts;
    }, [initialUMKM]);

    // Filter Logic
    const filteredUMKM = useMemo(() => {
        return initialUMKM.filter((umkm) => {
            // Category Filter
            if (selectedCategory !== "Semua" && umkm.type !== selectedCategory) {
                return false;
            }

            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    umkm.businessName.toLowerCase().includes(query) ||
                    (umkm.description && umkm.description.toLowerCase().includes(query)) ||
                    umkm.owner.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [initialUMKM, selectedCategory, searchQuery]);

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari UMKM..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-sm group-hover:shadow-md"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                </div>
            </div>

            {/* Filter Categories */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory("Semua")}
                    className={`px-4 py-2 rounded-full font-medium transition-colors text-sm flex items-center gap-2 ${selectedCategory === "Semua"
                        ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue/30"
                        }`}
                >
                    Semua
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === "Semua" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {categoryCounts["Semua"]}
                    </span>
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm flex items-center gap-2 ${selectedCategory === category
                            ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue/30"
                            }`}
                    >
                        {category}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === category ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                            {categoryCounts[category] || 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* UMKM List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUMKM.length > 0 ? (
                    filteredUMKM.map((umkm, index) => (
                        <div
                            key={index} // or umkm.id if available
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-blue hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="rounded-lg bg-brand-blue/10 p-3 flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                    <Store className="h-6 w-6 text-brand-blue group-hover:text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-brand-dark text-lg mb-1 truncate" title={umkm.businessName}>{umkm.businessName}</h3>
                                    <span className="inline-block px-2 py-1 bg-brand-cream text-brand-blue text-xs rounded-full font-medium border border-brand-blue/10">
                                        {umkm.type}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-xs text-gray-500 uppercase tracking-wider">Pemilik</div>
                                        <div className="font-medium text-gray-900 truncate">{umkm.owner}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700 px-2">
                                    <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                    <div className="truncate">{umkm.address}</div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-700 px-2">
                                    <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                    <a href={`tel:${umkm.phone}`} className="hover:text-brand-blue font-medium transition-colors">
                                        {umkm.phone}
                                    </a>
                                </div>

                                {umkm.description && (
                                    <div className="pt-3 border-t border-gray-100 mt-2 px-1">
                                        <p className="text-gray-600 italic line-clamp-3 text-xs leading-relaxed">{umkm.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))) : (
                    <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Tidak ada UMKM yang ditemukan.</p>
                        {searchQuery && (
                            <p className="text-sm text-gray-400 mt-2">Coba kata kunci lain.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
