import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuIndicatorVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuService } from './navigation-menu.service';

/** The arrow that slides along the bar to point at the trigger currently owning the viewport. */
@Component({
  selector: 'z-navigation-menu-indicator, [z-navigation-menu-indicator]',
  template: `
    <div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-indicator',
    'aria-hidden': 'true',
    '[attr.data-state]': "visible() ? 'visible' : 'hidden'",
    '[style.translate]': 'geometry().translate',
    '[style.width.px]': 'geometry().width',
    '[style.opacity]': 'visible() ? 1 : 0',
  },
  exportAs: 'zNavigationMenuIndicator',
})
export class ZardNavigationMenuIndicatorComponent {
  private readonly service = inject(ZardNavigationMenuService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly class = input<ClassValue>('');

  /** Kept as the last known position so hiding fades out in place instead of jumping to zero. */
  private readonly measured = signal({ translate: '0px', width: 0 });

  protected readonly visible = computed(() => this.service.isOpen());
  protected readonly geometry = this.measured.asReadonly();
  protected readonly classes = computed(() => mergeClasses(navigationMenuIndicatorVariants(), this.class()));

  constructor() {
    effect(() => {
      const active = this.service.active();
      const root = this.service.rootElement();

      if (!active || !root || !isPlatformBrowser(this.platformId)) return;

      const trigger = active.element.getBoundingClientRect();
      const bar = root.getBoundingClientRect();

      this.measured.set({ translate: `${trigger.left - bar.left}px`, width: trigger.width });
    });
  }
}
