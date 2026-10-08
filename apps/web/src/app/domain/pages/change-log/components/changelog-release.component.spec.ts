import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogReleaseComponent } from './changelog-release.component';
import { type ChangelogRelease } from '../entries/changelog-entry.interface';

describe('ChangelogReleaseComponent', () => {
  let fixture: ComponentFixture<ChangelogReleaseComponent>;

  const release: ChangelogRelease = {
    version: '1.0.0',
    title: 'Zard UI v1.0 is here',
    summary: 'A stable 1.0.',
    video: '/video/release-1.0.mp4',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangelogReleaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogReleaseComponent);
    fixture.componentRef.setInput('release', release);
    fixture.detectChanges();
  });

  function video(): HTMLVideoElement {
    return (fixture.nativeElement as HTMLElement).querySelector('video') as HTMLVideoElement;
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('plays the release clip like a GIF: on its own, muted, in a loop and without controls', () => {
    const clip = video();
    expect(clip.getAttribute('src')).toBe(release.video);
    expect(clip.muted).toBe(true);
    expect(clip.hasAttribute('muted')).toBe(true);
    expect(clip.hasAttribute('autoplay')).toBe(true);
    expect(clip.hasAttribute('loop')).toBe(true);
    expect(clip.hasAttribute('playsinline')).toBe(true);
    expect(clip.hasAttribute('controls')).toBe(false);
  });

  it('names the clip with the version from the input, not a literal', () => {
    expect(video().getAttribute('aria-label')).toBe('zard/ui v1.0.0 release');
  });

  it('renders the title and the description below the clip', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('figcaption h2');
    expect(heading?.textContent?.trim()).toBe(release.title);
    expect(compiled.querySelector('figcaption p')?.textContent?.trim()).toBe(release.summary);
    expect(video().compareDocumentPosition(heading as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
