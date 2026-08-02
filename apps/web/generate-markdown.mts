/**
 * Generates a raw Markdown file for every documented component, mirroring its
 * docs page URL: `/docs/components/<name>` -> `public/docs/components/<name>.md`.
 *
 * Component pages are fully parameterized, so their Markdown is derived from the
 * same structured `ComponentData` the site renders (via `loadData()` + the shared
 * `serializeComponentToMarkdown`) — no drift. Static docs pages are maintained by
 * hand under `public/docs/**` and are left untouched by this script.
 *
 * The files are committed and served as plain static assets (like `llms.txt`), so
 * `<path>.md` is genuinely navigable in dev and prod without a server route.
 *
 * Run with the web tsconfig so path aliases + Angular partial-compilation resolve:
 *   npx tsx --tsconfig apps/web/tsconfig.json apps/web/generate-markdown.mts [--watch]
 */
import '@angular/compiler';

import { Window } from 'happy-dom';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Angular's partially-compiled component modules touch browser globals at load
// time. Provide the few Node lacks before importing anything Angular.
const win = new Window({ url: 'http://localhost' });
const globals = globalThis as Record<string, unknown>;
globals['window'] = win;
globals['document'] = win.document;
globals['HTMLElement'] = win.HTMLElement;

const { COMPONENTS_REGISTRY } = await import('@doc/shared/constants/components.constant');
const { serializeComponentToMarkdown, serializeFallbackMarkdown } = await import('@doc/shared/utils/markdown-serializer');

const OUTPUT_DIR = resolve('apps/web/public/docs/components');

async function generate(): Promise<void> {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const degraded: Array<{ name: string; error: string }> = [];
  let full = 0;

  for (const entry of COMPONENTS_REGISTRY) {
    const routePath = `/docs/components/${entry.componentName}`;
    let markdown: string;

    try {
      markdown = serializeComponentToMarkdown(await entry.loadData());
      full++;
    } catch (error) {
      // A few modules can't be evaluated by esbuild/tsx (parameter decorators,
      // circular init). Fall back to a minimal doc so the `.md` still exists.
      markdown = serializeFallbackMarkdown(entry.componentName, entry.description, routePath);
      degraded.push({ name: entry.componentName, error: error instanceof Error ? error.message : String(error) });
    }

    writeFileSync(join(OUTPUT_DIR, `${entry.componentName}.md`), markdown, 'utf-8');
  }

  console.log(`✅ Wrote ${full} full + ${degraded.length} minimal component markdown files to ${OUTPUT_DIR}`);
  if (degraded.length) {
    console.warn(`⚠️  Minimal (loadData failed):`);
    degraded.forEach(f => console.warn(`   - ${f.name}: ${f.error.split('\n')[0]}`));
  }
}

await generate();
