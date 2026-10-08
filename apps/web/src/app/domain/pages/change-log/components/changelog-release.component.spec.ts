import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogReleaseComponent } from './changelog-release.component';
import { type ChangelogRelease } from '../entries/changelog-entry.interface';

describe('ChangelogReleaseComponent', () => {
  let fixture: ComponentFixture<ChangelogReleaseComponent>;
  let play: jest.SpyInstance;
  let pause: jest.SpyInstance;

  const release: ChangelogRelease = {
    version: '1.0.0',
    title: 'Zard UI v1.0 is here',
    summary: 'A stable 1.0.',
    video: '/video/release-1.0.mp4',
  };

  function mockReducedMotion(reduce: boolean): void {
    jest
      .spyOn(window, 'matchMedia')
      .mockImplementation(
        (query: string) => ({ matches: reduce && query.includes('reduce'), media: query }) as MediaQueryList,
      );
  }

  async function render(): Promise<void> {
    await TestBed.configureTestingModule({ imports: [ChangelogReleaseComponent] }).compileComponents();
    fixture = TestBed.createComponent(ChangelogReleaseComponent);
    fixture.componentRef.setInput('release', release);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function video(): HTMLVideoElement {
    return (fixture.nativeElement as HTMLElement).querySelector('video') as HTMLVideoElement;
  }

  function toggle(): HTMLButtonElement {
    return (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
  }

  beforeEach(() => {
    play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    });
    pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when motion is allowed', () => {
    beforeEach(async () => {
      mockReducedMotion(false);
      await render();
    });

    it('plays the clip like a GIF: on its own, muted, in a loop and without player controls', () => {
      const clip = video();
      expect(clip.getAttribute('src')).toBe(release.video);
      expect(clip.muted).toBe(true);
      expect(clip.hasAttribute('muted')).toBe(true);
      expect(clip.hasAttribute('loop')).toBe(true);
      expect(clip.hasAttribute('playsinline')).toBe(true);
      expect(clip.hasAttribute('controls')).toBe(false);
      expect(play).toHaveBeenCalled();
    });

    it('offers a button that pauses the clip, since it runs longer than five seconds', () => {
      fixture.detectChanges();
      expect(toggle().getAttribute('aria-label')).toBe('Pause the release clip');

      Object.defineProperty(video(), 'paused', { configurable: true, value: false });
      toggle().click();
      fixture.detectChanges();

      expect(pause).toHaveBeenCalled();
      expect(toggle().getAttribute('aria-label')).toBe('Play the release clip');
    });
  });

  describe('when the reader prefers reduced motion', () => {
    beforeEach(async () => {
      mockReducedMotion(true);
      await render();
    });

    it('does not start the clip on its own, and keeps the play button visible', () => {
      expect(play).not.toHaveBeenCalled();
      expect(toggle().getAttribute('aria-label')).toBe('Play the release clip');
      expect(toggle().classList.contains('opacity-100')).toBe(true);
    });

    it('starts the clip when the reader asks for it', () => {
      Object.defineProperty(video(), 'paused', { configurable: true, value: true });
      toggle().click();
      expect(play).toHaveBeenCalled();
    });
  });

  it('names the clip with the version from the input and renders the title and description below it', async () => {
    mockReducedMotion(true);
    await render();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(video().getAttribute('aria-label')).toBe('zard/ui v1.0.0 release');
    const heading = compiled.querySelector('figcaption h2');
    expect(heading?.textContent?.trim()).toBe(release.title);
    expect(compiled.querySelector('figcaption p')?.textContent?.trim()).toBe(release.summary);
    expect(video().compareDocumentPosition(heading as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
