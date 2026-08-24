import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

/** Merges CVA variants with a consumer's `class` input, last write winning. */
export function mergeClasses(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
