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
