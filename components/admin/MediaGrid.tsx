/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { deleteImage } from "@/actions/media";
import { useRouter } from "next/navigation";

interface MediaGridProps {
  initialImages: string[];
}

export default function MediaGrid({ initialImages }: MediaGridProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (path: string) => {
    if (confirm(`Are you sure you want to delete this image?\n${path}`)) {
      setDeleting(path);
      const result = await deleteImage(path);

      if (result.success) {
        setImages(images.filter((img) => img !== path));
        router.refresh();
      } else {
        alert("Failed to delete image: " + result.error);
      }
      setDeleting(null);
    }
  };

  const filteredImages = images.filter(img => !img.endsWith('.gitkeep'));

  return (
    <div>
      {filteredImages.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredImages.map((path) => (
            <div
              key={path}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow aspect-square"
            >
              <img
                src={path}
                alt={path}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <button
                    onClick={() => {
                        navigator.clipboard.writeText(path);
                        alert("Path copied to clipboard!");
                    }}
                    className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                    title="Copy URL"
                 >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                 </button>
                 <button
                    onClick={() => handleDelete(path)}
                    disabled={deleting === path}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
                    title="Delete Image"
                 >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                 </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-xs text-gray-600 truncate">
                  {path.split('/').pop()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
