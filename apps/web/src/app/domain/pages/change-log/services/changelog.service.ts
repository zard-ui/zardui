import { Injectable, signal } from '@angular/core';

import { type ChangelogEntry, type ChangelogExample } from '../entries/changelog-entry.interface';
import { CHANGELOG_ENTRIES } from '../entries/changelog-registry';

/** How many entries the changelog index shows in full; the older ones are listed as links, as on shadcn/ui. */
export const CHANGELOG_INDEX_SIZE = 5;

/**
 * Owns the changelog data: the (static, lightweight) list of entries plus the
 * cache of demo payloads, which are fetched on demand — one module per entry.
 */
@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  /** Every published entry, newest first. */
  readonly entries = CHANGELOG_ENTRIES;

  /** The entries the index shows in full. */
  readonly latest = this.entries.slice(0, CHANGELOG_INDEX_SIZE);

  /** The rest, listed under "More Updates". */
  readonly older = this.entries.slice(CHANGELOG_INDEX_SIZE);

  private readonly loaded = signal<Record<string, ChangelogExample[]>>({});
  private readonly requests = new Map<string, Promise<void>>();

  /** The entry published at `/docs/changelog/<slug>`. */
  bySlug(slug: string | null | undefined): ChangelogEntry | undefined {
    return this.entries.find(entry => entry.meta.slug === slug);
  }

  /** The entry an old `/docs/changelog#<id>` link pointed to. */
  byId(id: string | null | undefined): ChangelogEntry | undefined {
    return this.entries.find(entry => entry.meta.id === id);
  }

  /** An entry's demos, or `undefined` while its payload has not been loaded yet. */
  examplesOf(id: string): ChangelogExample[] | undefined {
    return this.loaded()[id];
  }

  /** Loads an entry's demo payload. Concurrent calls share a single import. */
  load(entry: ChangelogEntry): Promise<void> {
    const { id } = entry.meta;
    const pending = this.requests.get(id);
    if (pending) return pending;
    if (!entry.loadExamples) return Promise.resolve();

    const request = entry
      .loadExamples()
      .then(examples => this.loaded.update(current => ({ ...current, [id]: examples })));
    this.requests.set(id, request);
    return request;
  }

  /** Loads the payload of several entries — used on the server, where the prerendered HTML must be complete. */
  loadAll(entries: readonly ChangelogEntry[] = this.entries): Promise<void> {
    return Promise.all(entries.map(entry => this.load(entry))).then(() => undefined);
  }
}
