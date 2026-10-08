```typescript title="index.ts" copyButton showLineNumbers
export * from './merge-classes';
export * from './noop';
export * from './number';
```

```typescript title="merge-classes.ts" copyButton showLineNumbers
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

/** Merges CVA variants with a consumer's `class` input, last write winning. */
export function mergeClasses(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

```typescript title="noop.ts" copyButton showLineNumbers
/** Does nothing. Used as the initial value of a ControlValueAccessor callback. */
export const noopFn = (): void => void 0;
```

```typescript title="number.ts" copyButton showLineNumbers
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
