import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transform(value: boolean | string): boolean {
  return typeof value === 'string' ? value === '' : value;
}

export function generateId(prefix = ''): string {
  const id = crypto.randomUUID();
  return prefix ? `${prefix}-${id}` : id;
}

export const noopFn = () => void 0;

export const isElementContentTruncated = (element: HTMLElement | undefined): boolean => {
  if (!element) {
    return false;
  }
  const range = document.createRange();
  range.selectNodeContents(element);
  const rangeWidth = range.getBoundingClientRect().width;
  const elementWidth = element.getBoundingClientRect().width;

  return rangeWidth > elementWidth;
};
