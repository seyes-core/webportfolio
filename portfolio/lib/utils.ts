import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely, resolving conflicts (e.g. "p-2 p-4" -> "p-4").
 * Standard shadcn/ui convention, used by every component in this system.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date string as "Jan 2025" for timeline/log entries. */
export function formatMonthYear(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Clamp a number between min and max — used by scroll-linked motion values. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
