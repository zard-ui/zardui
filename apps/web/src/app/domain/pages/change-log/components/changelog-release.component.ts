import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type ChangelogRelease } from '../entries/changelog-entry.interface';

/**
 * The v1 launch banner — a release moment, not another card in the monthly
 * timeline. Rendered by the changelog page above the timeline for whichever
 * entry carries `release` (there is at most one).
 *
 * The clip is shown the way a GIF would be: it starts on its own, loops, and has
 * no controls. A muted, inline `<video>` does that at a fraction of a GIF's
 * weight. `muted` is written both as an attribute and as a property: the
 * attribute is what the server-rendered HTML carries, so the browser may
 * autoplay before hydration, and the property is what a client-side render
 * sets, since Angular writes a static `muted` only as an attribute.
 */
@Component({
  selector: 'z-changelog-release',
  template: `
    <figure class="flex flex-col gap-6">
      <video
        class="bg-muted aspect-video w-full rounded-xl border object-cover"
        [src]="release().video"
        [attr.aria-label]="'zard/ui v' + release().version + ' release'"
        [muted]="true"
        muted
        autoplay
        loop
        playsinline
        disablepictureinpicture
        preload="auto"
      ></video>

      <figcaption>
        <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ release().title }}</h2>
        <p class="text-muted-foreground mt-3 max-w-2xl text-base text-balance">{{ release().summary }}</p>
      </figcaption>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogReleaseComponent {
  readonly release = input.required<ChangelogRelease>();
}
