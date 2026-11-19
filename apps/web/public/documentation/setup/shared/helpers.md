```typescript title="index.ts" copyButton showLineNumbers
export * from './merge-classes';
export * from './noop';
export * from './number';
```

```typescript title="merge-classes.ts" copyButton showLineNumbers
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

export type { ClassValue };

/**
 * `tailwind-merge`, told how Tailwind v4 really cascades a font size and a line height.
 *
 * Out of the box a later `text-xs` drops an earlier `leading-normal`, as if `text-xs` always set its own line height.
 * In v4 it does not: it reads `--tw-leading`, which any `leading-*` sets, so the two never compete and the leading
 * survives. Dropping it made an installed component (where the style's classes and the consumer's are one string)
 * differ from the same component in the docs (where the style's rule sits in a lower layer and nothing is merged).
 * `text-xs/relaxed` (a size that carries its leading) still conflicts with a later `leading-*`, as it should.
 */
const twMerge = extendTailwindMerge({
  override: { conflictingClassGroups: { 'font-size': [] } },
});

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

function getDecimalCount(value: number): number {
  // also handles exponent notation such as 1e-7
  const [mantissa, exponent = '0'] = String(value).split('e');
  return Math.max(0, (mantissa.split('.')[1] ?? '').length - Number(exponent));
}

function roundToStep(value: number, min: number, step: number): number {
  const stepped = Math.round((value - min) / step) * step + min;
  // drop floating point noise such as 0.30000000000000004 by keeping the precision of step and min
  const decimals = Math.max(getDecimalCount(step), getDecimalCount(min));
  return Number(stepped.toFixed(decimals));
}

function convertValueToPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

export { clamp, roundToStep, convertValueToPercentage };
```
