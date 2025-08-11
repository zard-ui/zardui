<<<<<<<< HEAD:apps/web/public/documentation/setup/angular/manual/helpers.md
```typescript title="utils/merge-classes.ts" copyButton showLineNumbers
========
```typescript
>>>>>>>> origin/master:apps/web/public/installation/manual/utils.md
import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transform(value: boolean | string): boolean {
  return typeof value === 'string' ? value === '' : value;
}
```