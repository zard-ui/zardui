```typescript title="utils/merge-classes.ts" copyButton showLineNumbers
import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transform(value: boolean | string): boolean {
  return typeof value === 'string' ? value === '' : value;
}
```

```typescript title="utils/cn.ts" expandable="true" copyButton showLineNumbers
import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

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
```

```typescript title="utils/numbers.ts" expandable="true" copyButton showLineNumbers
function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, min: number, step: number): number {
  return Math.round((value - min) / step) * step + min;
}

function convertValueToPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

export { clamp, roundToStep, convertValueToPercentage };
```
