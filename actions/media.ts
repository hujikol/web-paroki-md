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
    // We still return separate arrays to maintain API compatibility for now,
    // but both will contain the same list or we can try to infer type from filename if needed.
    // However, the new UI uses a Unified Gallery, so effectively we just need "all".
    // For backward compatibility with existing components that might expect 'banners'/'inline' keys:
    
    const allImages = await listFiles("images");
    
    // Also try to list old folders to be safe?
    // The user wants to "remake" structure, implying we might ignore old ones or assume migration.
    // Let's simpler: Just return everything in 'banners' key (or split arbitrarily) 
    // OR better: Return all in both? No, that duplicates.
    // The previous API returned { banners: [], inline: [] }.
    // The new MediaGrid uses [...banners, ...inline]. 
    // So we can just put everything in 'inline' or 'banners' and leave the other empty, 
    // or splitting isn't necessary anymore.
    // Let's put everything in a single list and return it as 'banners' (arbitrary choice) + 'inline' (empty)
    // or better, let's fix the return type to be simpler in a future refactor.
    // For now, let's return everything in 'inline' and empty 'banners' to satisfy the Type,
    // BUT the MediaPage component merges them: `const allImages = [...banners, ...inline];`
    // So this is safe.
    
    // WAIT! listFiles("images") returns "images/foo.jpg", "images/bar.png"
    // AND it might return "images/banners" (directory) if not filtered out?
    // listFiles implementation already filters `item.type === "file"`.
    
    // Special handling: We might want to include legacy folders if they still exist?
    // If the user hasn't moved files yet, listFiles("images") won't show files inside "images/banners/".
    // So we should try to list "images/banners" and "images/inline" AND "images/" just to be robust
    // until migration is complete.
    
    const [rootImages, legacyBanners, legacyInline] = await Promise.all([
        listFiles("images"),
        listFiles("images/banners").catch(() => []), // Catch 404
        listFiles("images/inline").catch(() => []), 
    ]);

    // Filter out directories from rootImages just in case (though listFiles does it, it might not catch deeply nested ones depending on impl)
    // listFiles only returns files.
    
    const allPaths = [
        ...rootImages.map(p => `/${p}`),
        ...legacyBanners.map(p => `/${p}`),
        ...legacyInline.map(p => `/${p}`)
    ];
    
    // Deduplicate just in case
    const uniquePaths = Array.from(new Set(allPaths));

    return {
      banners: [], // Deprecated
      inline: uniquePaths, // Use this for all
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
