import { Injectable, Type } from '@angular/core';

import { type ChangelogEntryComponent, type ChangelogEntryConfig } from '../entries/changelog-entry.interface';
import { ChangelogRegistry } from '../entries/changelog-registry';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  getAllEntries(): ChangelogEntryConfig[] {
    return ChangelogRegistry.getAllEntries();
  }

  getComponent(id: string): Type<ChangelogEntryComponent> | undefined {
    return ChangelogRegistry.getComponent(id);
  }

  hasEntry(id: string): boolean {
    return ChangelogRegistry.hasComponent(id);
  }
}
