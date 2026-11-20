import { TestBed } from '@angular/core/testing';

import { CHANGELOG_INDEX_SIZE, ChangelogService } from './changelog.service';
import { anchorOf } from '../components/changelog-entry-body.component';

describe('ChangelogService', () => {
  let service: ChangelogService;

  beforeEach(() => {
    service = TestBed.inject(ChangelogService);
  });

  it('splits the entries between the index and "More Updates", newest first', () => {
    expect(service.latest).toHaveLength(CHANGELOG_INDEX_SIZE);
    expect([...service.latest, ...service.older]).toEqual(service.entries);
  });

  it('finds an entry by the slug of its page', () => {
    expect(service.bySlug('2026-11-create')?.meta.title).toBe('Create');
    expect(service.bySlug('nope')).toBeUndefined();
    expect(service.bySlug(null)).toBeUndefined();
  });

  // Old links point at `/docs/changelog#<id>`, from when every month lived on one page.
  it('finds an entry by the anchor it had on the single changelog page', () => {
    expect(service.byId('07-2026')?.meta.slug).toBe('2026-07-field-item-sonner');
  });
});

describe('anchorOf', () => {
  it('turns a heading into the id its section is linked by', () => {
    expect(anchorOf('Start a project with create')).toBe('start-a-project-with-create');
    expect(anchorOf('provideZard() and a Private Registry')).toBe('providezard-and-a-private-registry');
  });
});
