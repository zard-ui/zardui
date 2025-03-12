import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transform(value: boolean | string): boolean {
  return typeof value === 'string' ? value === '' : value;
}
