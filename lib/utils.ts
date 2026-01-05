import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadingTime(content: any): number {
  try {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    // Remove HTML tags and special chars roughly
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    const words = cleanText.split(" ").length;
    return Math.max(1, Math.ceil(words / 200));
  } catch (e) {
    return 1;
  }
}
