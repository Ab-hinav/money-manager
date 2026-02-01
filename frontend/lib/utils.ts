import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl() {
  // If undefined, use relative path on client to leverage Next.js Rewrites
  if (typeof window !== "undefined") {
    return "";
  }
  
  // Server-side: Use internal K8s URL or local dev fallback
  if (process.env.BACKEND_INTERNAL_URL) {
    return process.env.BACKEND_INTERNAL_URL;
  }

  // Fallback for manual overrides or local dev
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  return "http://localhost:8080";
}
