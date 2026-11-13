import type { Type } from '@angular/core';

import type { CodeBlockData, CodeTabData } from '@highlight/types';

/** A live demo and the code it is built from. */
export interface AiElementExample {
  /** Unique on the page; the e2e tests find the demo by it. */
  name: string;
  component: Type<unknown>;
  codeData: CodeBlockData;
  /** Optional CSS min-height for the preview area, for demos that grow while they stream. */
  previewHeight?: string;
}

/**
 * One piece of a section, rendered in order. Prose takes the inline subset of the `prose` directive:
 * `code`, **bold**, [links](/docs/components/trace) and `- ` bullets.
 */
export type AiElementBlock =
  { prose: string } | { example: AiElementExample } | { code: CodeBlockData } | { table: AiElementTable };

/** A reference table. Cells take the same inline prose subset. */
export interface AiElementTable {
  columns: string[];
  rows: string[][];
}

export interface AiElementSection {
  /** The anchor, also used by the table of contents. */
  id: string;
  title: string;
  blocks: AiElementBlock[];
}

/**
 * What a pattern page shows, beyond the name, description and components that AI_ELEMENTS lists.
 * Laid out like the shadcn/ui pages: the preview, a few paragraphs, Installation, then a section per topic.
 */
export interface AiElementData {
  slug: string;
  preview: AiElementExample;
  /** Paragraphs after the preview: what the pattern is for and what it is built from. */
  intro: string[];
  /** The `zard-cli add` command for the components the pattern is built with, one tab per package manager. */
  install: CodeTabData;
  sections: AiElementSection[];
}
