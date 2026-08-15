import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, inject, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuContentVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuService } from './navigation-menu.service';

/**
 * Holds the links of one trigger. In the shared viewport it is plain content — the viewport draws
 * the surface; in overlay mode it *is* the popup, so it gets the background, ring and shadow.
 */
@Directive({
  selector: '[z-navigation-menu-content]',
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-content',
    tabindex: '0',
    '[attr.data-state]': "'open'",
    '[attr.data-motion]': 'motion()',
  },
  // No focus trap: a navigation popup is not a modal. Trapping would also mean auto-capturing the
  // focus on open, which for a hover-opened menu lands `focus:bg-muted` and the focus ring on a
  // link the pointer never touched. Keyboard access is `CdkMenu`'s job, as it is in the dropdown.
  hostDirectives: [CdkMenu],
  exportAs: 'zNavigationMenuContent',
})
export class ZardNavigationMenuContentDirective {
  /** Present when the content is declared inside a `<z-navigation-menu>`. */
  private readonly service = inject(ZardNavigationMenuService, { optional: true });

  readonly class = input<ClassValue>('');

  private readonly isViewportMode = computed(() => this.service?.viewport() ?? false);

  /** Drives the directional slide of the CVA when the viewport morphs between two triggers. */
  protected readonly motion = computed(() => (this.isViewportMode() ? this.service?.motion() : null));

  protected readonly classes = computed(() =>
    mergeClasses(navigationMenuContentVariants({ viewport: this.isViewportMode() }), this.class()),
  );
}
