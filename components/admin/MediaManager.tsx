/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import MediaGrid from "./MediaGrid";
import ImageUploader from "./ImageUploader";
import { useRouter } from "next/navigation";

interface MediaManagerProps {
  initialImages: string[];
}

export default function MediaManager({ initialImages }: MediaManagerProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();

  const handleUploadComplete = (path: string) => {
    // Refresh to show new image
    router.refresh();
    setIsUploadOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
            Media Library
        </h1>
        <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-darkBlue shadow-md transition-colors flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Image
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
         <MediaGrid initialImages={initialImages} />
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsUploadOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                      Upload New Image
                    </h3>
                    
                    <div className="space-y-4">
                        {/* We can offer a choice or just default. Since "unify", let's offer a simple toggle or just use Inline as default for versatility */}
                        <p className="text-sm text-gray-500 mb-4">
                            Select an image to upload. It will be optimized and stored in the unified library.
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                           <ImageUploader type="inline" onUploadComplete={handleUploadComplete} />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsUploadOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
