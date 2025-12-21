"use client";

import { useState } from "react";
import { uploadImage } from "@/actions/media";

interface ImageUploaderProps {
  type: "banner" | "inline";
  onUploadComplete?: (path: string) => void;
}

export default function ImageUploader({ type, onUploadComplete }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const result = await uploadImage(file, type);

    setUploading(false);

    if (result.success && result.path) {
      setUploadedPath(result.path);
      onUploadComplete?.(result.path);
    } else {
      setError(result.error || "Upload failed");
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const copyToClipboard = () => {
    if (uploadedPath) {
      navigator.clipboard.writeText(uploadedPath);
      alert("Path copied to clipboard!");
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            {uploading && <p className="text-blue-600">Uploading...</p>}
            {uploadedPath && (
              <div className="space-y-2">
                <p className="text-green-600 dark:text-green-400 font-medium">Upload successful!</p>
                <div className="flex items-center gap-2 justify-center">
                  <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                    {uploadedPath}
                  </code>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4">📁</div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag and drop an image here, or click to select
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id={`file-input-${type}`}
            />
            <label
              htmlFor={`file-input-${type}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              Choose File
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Max 10MB • Will be converted to WebP
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
