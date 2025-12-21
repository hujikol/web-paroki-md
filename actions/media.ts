"use server";

import { commitFiles, listFiles, deleteFile } from "@/lib/github/operations";
import { processImage, generateImageFilename } from "@/lib/images/processor";

export async function uploadImage(
  file: File,
  type: "banner" | "inline" // Kept for processor optimization but ignored for folder structure
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    // Validate file
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image (still optimized based on intent)
    const processed = await processImage(buffer, type);

    // Generate filename
    const filename = generateImageFilename(file.name, type);
    
    // UNIFIED STRUCTURE: All images go to root images/
    const path = `images/${filename}`;

    // Commit to GitHub
    await commitFiles(
      [{ path, content: processed.buffer, encoding: "base64" }],
      `Add image: ${filename}`
    );

    return { success: true, path: `/${path}` };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  }
}

export async function listImages(): Promise<{
  banners: string[];
  inline: string[];
}> {
  try {
    // UNIFIED STRUCTURE: List all files in images/
    const allImages = await listFiles("images");
    
    // Return all images in the 'inline' key which is used as the primary list in MediaManager
    // banners is kept empty to preserve type compatibility but is effectively deprecated
    
    return {
      banners: [], 
      inline: allImages.map(p => `/${p}`), 
    };
  } catch (error) {
    console.error("Error listing images:", error);
    return { banners: [], inline: [] };
  }
}

export async function deleteImage(path: string) {
  try {
    // Remove leading slash
    const filePath = path.startsWith("/") ? path.substring(1) : path;

    await deleteFile(filePath, `Delete image: ${filePath}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return { success: false, error: error.message };
  }
}
