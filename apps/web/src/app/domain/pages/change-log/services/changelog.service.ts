import { Injectable, signal } from '@angular/core';

import { type ChangelogEntry, type ChangelogExample } from '../entries/changelog-entry.interface';
import { CHANGELOG_ENTRIES } from '../entries/changelog-registry';

/**
 * Owns the changelog data: the (static, lightweight) list of months plus the
 * cache of demo payloads, which are fetched on demand — one module per month.
 */
@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  /** Every published month, newest first. */
  readonly entries = CHANGELOG_ENTRIES;

  private readonly loaded = signal<Record<string, ChangelogExample[]>>({});
  private readonly requests = new Map<string, Promise<void>>();

  /** A month's demos, or `undefined` while its payload has not been loaded yet. */
  examplesOf(id: string): ChangelogExample[] | undefined {
    return this.loaded()[id];
  }

  /** Loads a month's demo payload. Concurrent calls share a single import. */
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

  /** Loads every month's payload — used on the server, where the prerendered HTML must be complete. */
  loadAll(): Promise<void> {
    return Promise.all(this.entries.map(entry => this.load(entry))).then(() => undefined);
  }
}
