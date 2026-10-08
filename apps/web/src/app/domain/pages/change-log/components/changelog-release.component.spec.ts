import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ChangelogReleaseComponent } from './changelog-release.component';
import { type ChangelogRelease } from '../entries/changelog-entry.interface';

describe('ChangelogReleaseComponent', () => {
  let fixture: ComponentFixture<ChangelogReleaseComponent>;

  const release: ChangelogRelease = {
    version: '1.0.0',
    title: 'Zard UI v1.0 is here',
    summary: 'A stable 1.0.',
    facts: [
      { label: 'Components', value: '53+ components' },
      { label: 'CLI', value: 'zard-cli' },
    ],
    cta: { label: 'Get started', link: '/docs/installation' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangelogReleaseComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogReleaseComponent);
    fixture.componentRef.setInput('release', release);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the release title as a heading one level below the page h1', () => {
    const heading = (fixture.nativeElement as HTMLElement).querySelector('h2');
    expect(heading?.textContent?.trim()).toBe(release.title);
  });

  it('renders the version from the input, not a literal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('v1.0.0');
  });

  it('renders every fact', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    for (const fact of release.facts) {
      expect(compiled.textContent).toContain(fact.label);
      expect(compiled.textContent).toContain(fact.value);
    }
  });

  it('renders the call to action as a link to the given route', () => {
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[z-button]');
    expect(link?.textContent?.trim()).toBe('Get started');
    expect(link?.getAttribute('href')).toBe('/docs/installation');
  });

  it('marks decorative elements as hidden from assistive tech', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const hidden = compiled.querySelectorAll('[aria-hidden="true"]');
    expect(hidden.length).toBeGreaterThan(0);
  });
});
