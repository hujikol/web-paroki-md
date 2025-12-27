/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo } from "react";
import { deleteImage, MediaImage } from "@/actions/media";
import { useRouter } from "next/navigation";
import { useLoading } from "./LoadingProvider";
import Tooltip from "./Tooltip";

interface MediaGridProps {
  initialImages: MediaImage[];
}

type SortOption = "latest" | "name" | "size";

export default function MediaGrid({ initialImages }: MediaGridProps) {
  const { startTransition } = useLoading();
  const router = useRouter();
  const [images, setImages] = useState<MediaImage[]>(initialImages);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(25);

  // Sync state when initialImages changes (from router.refresh)
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTimestamp = (name: string) => {
    const parts = name.split('-');
    // Pattern: inline-basename-timestamp-hash.webp or basename-timestamp-hash.webp
    // timestamp is second-to-last
    const tsPart = parts[parts.length - 2];
    return parseInt(tsPart) || 0;
  };

  const sortedImages = useMemo(() => {
    const filtered = images.filter(img => !img.name.endsWith('.gitkeep'));
    
    return [...filtered].sort((a, b) => {
      if (sortBy === "latest") {
        return getTimestamp(b.name) - getTimestamp(a.name);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "size") {
        return b.size - a.size;
      }
      return 0;
    });
  }, [images, sortBy]);

  const effectiveItemsPerPage = itemsPerPage === "all" ? sortedImages.length : itemsPerPage;
  const totalPages = Math.ceil(sortedImages.length / effectiveItemsPerPage) || 1;
  
  const paginatedImages = useMemo(() => {
    if (itemsPerPage === "all") return sortedImages;
    const start = (currentPage - 1) * effectiveItemsPerPage;
    return sortedImages.slice(start, start + effectiveItemsPerPage);
  }, [sortedImages, currentPage, effectiveItemsPerPage, itemsPerPage]);

  const handleItemsPerPageChange = (val: string) => {
    setItemsPerPage(val === "all" ? "all" : parseInt(val));
    setCurrentPage(1);
  };

  // Reset to page 1 when sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const handleDelete = async (path: string) => {
    if (confirm(`Are you sure you want to delete this image?\n${path}`)) {
      startTransition(async () => {
        setDeleting(path);
        const result = await deleteImage(path);

        if (result.success) {
          setImages(images.filter((img) => img.path !== path));
          router.refresh();
        } else {
          alert("Failed to delete image: " + result.error);
        }
        setDeleting(null);
      });
    }
  };

  return (
    <div className="flex flex-col p-6 min-h-[600px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
               Total {sortedImages.length} images
            </div>
            {sortedImages.length > 0 && (
                <div className="text-sm font-medium text-gray-400">
                    Showing {Math.min((currentPage - 1) * effectiveItemsPerPage + 1, sortedImages.length)} - {Math.min(currentPage * effectiveItemsPerPage, sortedImages.length)}
                </div>
            )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Sort by:</label>
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white pl-3 pr-8 py-2 font-bold transition-all cursor-pointer hover:border-brand-blue/50 outline-none"
              >
                <option value="latest">Latest Upload</option>
                <option value="name">Name (A-Z)</option>
                <option value="size">Large Size First</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400 group-hover:text-brand-blue">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Show:</label>
            <div className="relative group">
              <select 
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="appearance-none text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white pl-3 pr-8 py-2 font-bold transition-all cursor-pointer hover:border-brand-blue/50 outline-none"
              >
                <option value={25}>25 items</option>
                <option value={50}>50 items</option>
                <option value="all">Show All</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400 group-hover:text-brand-blue">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {paginatedImages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 font-medium">No images found in your library.</p>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
            {paginatedImages.map((img) => (
                <div
                key={img.path}
                className="group/card relative bg-white border border-gray-100 rounded-md hover:shadow-md transition-all duration-300 aspect-square border-b-4 hover:border-b-brand-blue"
                >
                {/* Image Container with Zoom effect - this one HAS overflow-hidden */}
                <div className="absolute inset-0 overflow-hidden rounded-md bg-gray-50">
                    <img
                        src={img.path}
                        alt={img.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                </div>
                
                {/* Action Overlay - this one DOES NOT have overflow-hidden to allow tooltips to escape */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-10 rounded-md">
                    <div className="flex gap-2">
                        <Tooltip content="Copy Image URL">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(img.path);
                                    alert("Path copied to clipboard!");
                                }}
                                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-brand-cream hover:text-brand-blue transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </Tooltip>
                        <Tooltip content="Delete Image">
                            <button
                                onClick={() => handleDelete(img.path)}
                                disabled={deleting === img.path}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all transform hover:scale-110 active:scale-95 shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 border-t border-gray-100 flex flex-col gap-0.5 pointer-events-none">
                    <div className="text-[10px] font-extrabold text-gray-900 truncate">
                        {img.name}
                    </div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase drop-shadow-sm">
                        {formatSize(img.size)}
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* Pagination Controls */}
            {itemsPerPage !== "all" && totalPages > 1 && (
                <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 gap-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="text-gray-900 font-bold">{Math.min((currentPage - 1) * effectiveItemsPerPage + 1, sortedImages.length)}</span> to <span className="text-gray-900 font-bold">{Math.min(currentPage * effectiveItemsPerPage, sortedImages.length)}</span> of <span className="text-gray-900 font-bold">{sortedImages.length}</span> results
                    </p>
                    <nav className="inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="inline-flex items-center rounded-l-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-bold transition-colors ${
                                    currentPage === i + 1
                                        ? "z-10 bg-brand-blue text-white border-brand-blue"
                                        : "bg-white text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center rounded-r-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </>
      )}
    </div>
  );
}
