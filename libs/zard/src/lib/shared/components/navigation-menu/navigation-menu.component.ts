import type { BooleanInput } from '@angular/cdk/coercion';
import { PARENT_OR_NEW_MENU_STACK_PROVIDER } from '@angular/cdk/menu';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  navigationMenuVariants,
  type ZardNavigationMenuAlign,
} from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuViewportComponent } from './navigation-menu-viewport.component';
import { ZardNavigationMenuService } from './navigation-menu.service';

/**
 * Root of a navigation bar. With `zViewport` enabled (the default) every trigger inside shares a
 * single animated popup; with it disabled each trigger opens its own popup in an overlay.
 */
@Component({
  selector: 'z-navigation-menu, [z-navigation-menu]',
  imports: [ZardNavigationMenuViewportComponent],
  template: `
    <ng-content />

    @if (zViewport()) {
      <z-navigation-menu-viewport />
    }
  `,
  // The menu stack covers links declared straight on an item, with no content above them to provide it.
  providers: [ZardNavigationMenuService, PARENT_OR_NEW_MENU_STACK_PROVIDER],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu',
    '[attr.data-viewport]': 'zViewport()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown.escape)': 'onEscape()',
  },
  exportAs: 'zNavigationMenu',
})
export class ZardNavigationMenuComponent {
  private readonly service = inject(ZardNavigationMenuService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewportRef = viewChild(ZardNavigationMenuViewportComponent);

  readonly class = input<ClassValue>('');
  readonly zViewport = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
  readonly zAlign = input<ZardNavigationMenuAlign>('start');
  readonly zHoverDelay = input<number>(100);

  protected readonly classes = computed(() => mergeClasses(navigationMenuVariants(), this.class()));

  constructor() {
    this.service.rootElement.set(this.elementRef.nativeElement);

    effect(() => this.service.viewport.set(this.zViewport()));
    effect(() => this.service.hoverDelay.set(this.zHoverDelay()));
    effect(() => this.viewportRef()?.align.set(this.zAlign()));
  }

  protected onMouseEnter(): void {
    this.service.cancelScheduledClose();
  }

  /** Leaving the bar altogether closes the viewport, after the grace period of `zHoverDelay`. */
  protected onMouseLeave(): void {
    this.service.scheduleClose();
  }

  protected onEscape(): void {
    this.service.close();
  }
}
