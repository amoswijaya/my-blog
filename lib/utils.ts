import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtmlAndTruncate(html: string, maxLength = 150): string {
  const plainText = html
    .replace(/<[^>]+>/g, "")
    .replace(/\n/g, " ")
    .trim();
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength).trim() + "..."
    : plainText;
}
