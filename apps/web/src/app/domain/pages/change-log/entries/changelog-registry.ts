import { Type } from '@angular/core';

import { April2025Component } from './2025/april-2025.component';
import { August2025Component } from './2025/august-2025.component';
import { December2025Component } from './2025/december-2025.component';
import { July2025Component } from './2025/july-2025.component';
import { June2025Component } from './2025/june-2025.component';
import { March2025Component } from './2025/march-2025.component';
import { May2025Component } from './2025/may-2025.component';
import { November2025Component } from './2025/november-2025.component';
import { October2025Component } from './2025/october-2025.component';
import { September2025Component } from './2025/september-2025.component';
import { type ChangelogEntryComponent, type ChangelogEntryConfig } from './changelog-entry.interface';

/**
 * Registry of all changelog entry components
 * Add new components here as they are created
 *
 * Each component should export:
 * - meta: ChangelogEntryMeta (month, year, date, id)
 * - overview: string (description of changes)
 * - examples: ChangelogExample[] (components to showcase with demos)
 */
const CHANGELOG_COMPONENTS: Record<string, Type<ChangelogEntryComponent>> = {
  '12-2025': December2025Component,
  '11-2025': November2025Component,
  '10-2025': October2025Component,
  '09-2025': September2025Component,
  '08-2025': August2025Component,
  '07-2025': July2025Component,
  '06-2025': June2025Component,
  '05-2025': May2025Component,
  '04-2025': April2025Component,
  '03-2025': March2025Component,
};

export class ChangelogRegistry {
  /**
   * Get all available changelog entries sorted by date (newest first)
   */
  static getAllEntries(): ChangelogEntryConfig[] {
    return Object.entries(CHANGELOG_COMPONENTS)
      .map(([id, component]) => {
        // Create a temporary instance to get meta, overview, and examples
        const instance = new component() as ChangelogEntryComponent;
        return {
          id,
          component,
          meta: instance.meta,
          overview: instance.overview,
          examples: instance.examples,
          highlights: instance.highlights,
        };
      })
      .sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());
  }

  /**
   * Get a specific component by ID
   */
  static getComponent(id: string): Type<ChangelogEntryComponent> | undefined {
    return CHANGELOG_COMPONENTS[id];
  }

  /**
   * Check if a component exists for a given ID
   */
  static hasComponent(id: string): boolean {
    return id in CHANGELOG_COMPONENTS;
  }
}
