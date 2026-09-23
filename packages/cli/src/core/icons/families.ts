/**
 * The icon families `components.json` accepts under `icons`.
 *
 * Every component in the library draws through ng-icons' `<ng-icon>`, which is
 * family-agnostic: what ties the drawing to one family is the package the
 * symbols are imported from (`@ng-icons/lucide`) and the prefix they carry
 * (`lucideCheck`). Both are declared here, and that is all that separates one
 * family from another on the install path.
 *
 * This table is the local copy — the one used when the registry does not
 * answer. The authoritative list comes from `<registry>/icons.json`, which is
 * what lets a new family arrive without anyone updating the CLI.
 */

export interface IconFamilyInfo {
  /** How it appears in `components.json`. */
  readonly value: string;
  /** Display name, for prompts and reports. */
  readonly label: string;
  /** The npm package the project needs installed. */
  readonly package: string;
  /** The prefix of the symbols that package exports (`lucide` → `lucideCheck`). */
  readonly prefix: string;
}

/**
 * A string, not the union of the known families.
 *
 * The literal type would be more precise and more wrong: families now come from
 * the registry, so the valid set is whatever is published at run time, not
 * whatever existed when the CLI was compiled. `assertIconFamily` validates the
 * value against the catalog in hand.
 */
export type IconFamily = string;

export const ICON_FAMILIES: Record<string, IconFamilyInfo> = {
  lucide: {
    value: 'lucide',
    label: 'Lucide',
    package: '@ng-icons/lucide',
    prefix: 'lucide',
  },
};

/** The family `libs/zard` uses — the one the registry files are written in. */
export const SOURCE_ICON_FAMILY: IconFamily = 'lucide';

/** The package that registers `<ng-icon>`, shared by every family. */
export const ICON_CORE_PACKAGE = '@ng-icons/core';
