import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes using clsx and tailwind-merge.
 * This utility ensures that conflicting Tailwind classes are resolved correctly.
 *
 * @param inputs - A list of class names, objects, or arrays to merge
 * @returns A single string of merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
