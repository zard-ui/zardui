import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideMapPinOff } from '@ng-icons/lucide';

import { mergeClasses } from '@zard/utils/merge-classes';

/**
 * What stands in for a map that is not on screen: a quiet placeholder while it waits for its turn (this is also
 * what the server sends), or a short explanation when the browser has no WebGL2 to draw it with.
 */
@Component({
  selector: 'z-map-state',
  imports: [NgIcon],
  template: `
    @if (state() === 'unsupported') {
      <ng-icon name="lucideMapPinOff" class="text-muted-foreground size-6" aria-hidden="true" />
      <p class="text-sm font-medium">This map needs WebGL2</p>
      <p class="text-muted-foreground max-w-xs text-xs text-balance">
        Your browser or device cannot draw it. The rest of the page works as usual, and the code below is still yours to
        copy.
      </p>
    } @else {
      <ng-icon name="lucideMapPin" class="text-muted-foreground size-6 animate-pulse" aria-hidden="true" />
      <span class="sr-only">Loading map</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMapPin, lucideMapPinOff })],
  host: {
    '[class]': 'classes()',
    '[attr.role]': "state() === 'unsupported' ? 'status' : null",
    '[attr.aria-busy]': "state() === 'loading' ? 'true' : null",
    'data-slot': 'map-state',
    '[attr.data-state]': 'state()',
  },
})
export class MapStateComponent {
  readonly state = input<'loading' | 'unsupported'>('loading');
  readonly class = input('');

  protected readonly classes = computed(() =>
    mergeClasses(
      'bg-muted/40 flex size-full min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center',
      this.state() === 'loading' && 'border-solid',
      this.class(),
    ),
  );
}
