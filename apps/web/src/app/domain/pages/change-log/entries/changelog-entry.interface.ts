import { Type } from '@angular/core';

import type { CodeBlockData, CodeTabData } from '@highlight/types';

export interface ChangelogEntryMeta {
  month: string; // 'November 2025'
  year: number;
  monthNumber: number;
  date: Date;
  id: string; // '11-2025'
}

/** Closed set of highlight icons; the page maps each one to a Lucide icon. */
export type ChangelogHighlightIcon =
  | 'zap'
  | 'terminal'
  | 'moon'
  | 'package'
  | 'rocket'
  | 'shield'
  | 'code'
  | 'settings';

export interface ChangelogHighlight {
  title: string;
  description: string;
  icon: ChangelogHighlightIcon;
  code?: string; // Optional snippet to display (e.g. a CLI command)
}

/**
 * A component showcased by a monthly entry. This is the heavy half of an entry —
 * a real Angular demo component plus its highlighted code — so it lives in a
 * sibling `<month>.examples.ts` module loaded on demand by `loadExamples`.
 */
export interface ChangelogExample {
  name: string; // Demo variation: 'default', 'preview', 'basic', ...
  description?: string;
  component: Type<unknown>;
  componentName: string; // Component folder name, used for the install command
  codeData?: CodeBlockData;
  cliAdd?: CodeTabData; // `zard-cli add <componentName>` tabs
}

/**
 * A month of the changelog. Plain data — never an Angular component — so the
 * registry can read it without instantiating anything.
 */
export interface ChangelogEntry {
  meta: ChangelogEntryMeta;
  overview: string; // Summary of the month's changes
  highlights?: ChangelogHighlight[]; // Structural/DX improvements (no visual component)
  loadExamples?: () => Promise<ChangelogExample[]>; // Present when the month ships components
}
