import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }
// lib/utils.ts

/**
 * Formats a name string by capitalizing first letters
 */
export function getName(name: string | null | undefined): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Logs errors with proper formatting
 */
export function logError(error: any): void {
  console.error("\x1b[31mError:", error, "\x1b[0m");
}

/**
 * General utility functions
 */
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}