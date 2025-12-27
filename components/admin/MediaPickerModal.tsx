/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { listImages, uploadImages, MediaImage } from "@/actions/media";
import { useLoading } from "./LoadingProvider";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialTab?: "all" | "banner" | "inline";
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  initialTab = "all",
}: MediaPickerModalProps) {
  const { startTransition } = useLoading();
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(initialTab);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { inline } = await listImages();
      // Filter out gitkeep and other hidden files
      const filtered = inline.filter(img => !img.name.endsWith('.gitkeep'));
      setImages(filtered);
    } catch (err) {
      console.error("Failed to fetch images", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    startTransition(async () => {
        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            Array.from(files).forEach(file => formData.append("files", file));
            
            const result = await uploadImages(formData, "inline");
            if (result.success && result.paths) {
                // Refresh list
                await fetchImages();
            } else {
                setError(result.error || "Upload failed");
            }
        } catch (err) {
            setError("Upload failed");
        } finally {
            setUploading(false);
        }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full overflow-hidden">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight" id="modal-title">
                    Select Image
                  </h3>
                   <div className="flex gap-2">
                      <label className="px-4 py-2 bg-brand-blue text-white rounded-md cursor-pointer hover:bg-brand-darkBlue shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 text-xs font-medium">
                        {uploading ? (
                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        )}
                        <span>{uploading ? "Uploading..." : "Upload New"}</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading}/>
                      </label>
                      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                   </div>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">
                        {error}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                  <div className="flex justify-center py-20">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
                    {images.map((img) => (
                      <div 
                        key={img.path} 
                        className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-brand-blue"
                        onClick={() => onSelect(img.path)}
                      >
                        <img src={img.path} alt={img.name} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[10px] font-bold p-1 truncate px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {img.name}
                        </div>
                      </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500">
                            No images found. Upload one to get started.
                        </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
