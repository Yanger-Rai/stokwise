import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to create a URL-safe slug from a string
export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (except spaces and hyphens)
    .replace(/[\s_-]+/g, "-") // Collapse whitespace and dashes to a single dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
};
