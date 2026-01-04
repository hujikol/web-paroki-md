"use client";

import { useState, useMemo } from "react";
import { FileText, Link as LinkIcon, Download, Search } from "lucide-react";
import { Formulir } from "@/actions/data";

export default function FormulirList({ initialData, categories }: { initialData: Formulir[], categories: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const displayCategories = [
        "all",
        ...categories
    ];

    const filteredData = useMemo(() => {
        return initialData.filter((item) => {
            // Category Filter
            if (selectedCategory !== "all" && item.category !== selectedCategory) {
                return false;
            }

            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    item.title.toLowerCase().includes(query) ||
                    (item.description && item.description.toLowerCase().includes(query))
                );
            }

            return true;
        });
    }, [initialData, selectedCategory, searchQuery]);

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
                        placeholder="Cari Formulir..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-sm group-hover:shadow-md"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                </div>

                {/* Filter Categories */}
                <div className="flex flex-wrap gap-2">
                    {displayCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors text-sm ${selectedCategory === category
                                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-brand-blue hover:border-brand-blue/30"
                                }`}
                        >
                            {category === 'all' ? 'Semua' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Formulir List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:border-brand-blue hover:shadow-lg transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText className="h-24 w-24 text-brand-blue -mr-8 -mt-8 transform rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 bg-gray-100 text-gray-700`}>
                                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                    </div>
                                </div>

                                <h3 className="font-bold text-brand-dark text-lg mb-2">{item.title}</h3>

                                {item.description && (
                                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">{item.description}</p>
                                )}

                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-brand-blue font-medium hover:underline text-sm group/link"
                                >
                                    <Download className="h-4 w-4 group-hover/link:translate-y-0.5 transition-transform" />
                                    Download / Buka Link
                                </a>
                            </div>
                        </div>
                    ))) : (
                    <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Tidak ada formulir yang ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
