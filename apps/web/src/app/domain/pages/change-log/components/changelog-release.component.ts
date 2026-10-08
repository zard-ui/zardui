import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePause, lucidePlay } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { type ChangelogRelease } from '../entries/changelog-entry.interface';

/**
 * The v1 launch banner — a release moment, not another card in the monthly
 * timeline. Rendered by the changelog page above the timeline for whichever
 * entry carries `release` (there is at most one).
 *
 * The clip is shown the way a GIF would be: it starts on its own, loops, and
 * has no player chrome. A muted, inline `<video>` does that at a fraction of a
 * GIF's weight. Two things a GIF does not offer are added on purpose:
 * - It only starts on its own when the reader has not asked for reduced motion;
 *   playback begins after render, so the server HTML carries no `autoplay`
 *   that would start it before that preference is read.
 * - A pause/play button, shown on hover or focus, and kept visible while the
 *   clip is paused: moving content that runs longer than five seconds must be
 *   stoppable (WCAG 2.2.2).
 *
 * `muted` is written both as an attribute and as a property: the attribute is
 * what the server-rendered HTML carries, the property is what a client-side
 * render sets, since Angular writes a static `muted` only as an attribute.
 */
@Component({
  selector: 'z-changelog-release',
  imports: [NgIcon, ZardButtonComponent],
  template: `
    <figure class="flex flex-col gap-6">
      <div class="group relative">
        <video
          #clip
          class="bg-muted aspect-video w-full rounded-xl border object-cover"
          [src]="release().video"
          [attr.aria-label]="'zard/ui v' + release().version + ' release'"
          [muted]="true"
          muted
          loop
          playsinline
          disablepictureinpicture
          preload="auto"
          (play)="playing.set(true)"
          (pause)="playing.set(false)"
        ></video>

        <button
          type="button"
          z-button
          zType="secondary"
          zSize="icon-sm"
          [class]="toggleClasses()"
          [attr.aria-label]="playing() ? 'Pause the release clip' : 'Play the release clip'"
          (click)="toggle()"
        >
          <ng-icon [name]="playing() ? 'lucidePause' : 'lucidePlay'" aria-hidden="true" />
        </button>
      </div>

      <figcaption>
        <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ release().title }}</h2>
        <p class="text-muted-foreground mt-3 max-w-2xl text-base text-balance">{{ release().summary }}</p>
      </figcaption>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucidePause, lucidePlay })],
})
export class ChangelogReleaseComponent {
  readonly release = input.required<ChangelogRelease>();

  private readonly clip = viewChild.required<ElementRef<HTMLVideoElement>>('clip');

  protected readonly playing = signal(false);

  /** Out of the way while the clip plays; always visible once it is paused, so it can be resumed. */
  protected readonly toggleClasses = computed(
    () =>
      `absolute right-3 bottom-3 shadow-sm transition-opacity focus-visible:opacity-100 group-hover:opacity-100 ${
        this.playing() ? 'opacity-0' : 'opacity-100'
      }`,
  );

  constructor() {
    afterNextRender(() => {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      if (!reducedMotion) this.play();
    });
  }

  protected toggle(): void {
    if (this.clip().nativeElement.paused) {
      this.play();
    } else {
      this.clip().nativeElement.pause();
    }
  }

  private play(): void {
    // A browser may still refuse to autoplay; the button stays there to start it by hand.
    void this.clip()
      .nativeElement.play()
      ?.catch(() => this.playing.set(false));
  }
}
