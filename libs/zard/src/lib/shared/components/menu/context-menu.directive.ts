import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { DestroyRef, Directive, DOCUMENT, ElementRef, inject, input, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { noopFn } from '@/shared/utils/merge-classes';

@Directive({
  selector: '[z-context-menu]',
  host: {
    'data-slot': 'context-menu-trigger',
    '[attr.tabindex]': "'0'",
    '[style.cursor]': "'context-menu'",
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'cdkTrigger.isOpen()',
    '[attr.data-state]': "cdkTrigger.isOpen() ? 'open': 'closed'",
    '(contextmenu)': 'noopFn()',
    '(keydown)': 'handleKeyDown($event)',
  },
  hostDirectives: [
    {
      directive: CdkContextMenuTrigger,
      inputs: ['cdkContextMenuTriggerFor: zContextMenuTriggerFor'],
    },
  ],
})
export class ZardContextMenuDirective {
  protected readonly cdkTrigger = inject(CdkContextMenuTrigger, { host: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);

  readonly zContextMenuTriggerFor = input.required<TemplateRef<void>>();
  noopFn = noopFn;

  constructor() {
    this.cdkTrigger.menuPosition = [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
      },
    ];
    this.cdkTrigger.opened.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.attachCloseListeners());
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      this.open();
    }
  }

  private open(coordinates?: { x: number; y: number }): void {
    const coords = coordinates || this.getDefaultCoordinates();
    this.cdkTrigger.open(coords);
  }

  private getDefaultCoordinates(): { x: number; y: number } {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  private attachCloseListeners(): void {
    const closeMenu = () => {
      if (this.cdkTrigger.isOpen()) {
        this.cdkTrigger.close();
      }
    };

    const window = this.document.defaultView;
    if (window) {
      window.addEventListener('scroll', closeMenu, { passive: true });
      window.addEventListener('resize', closeMenu);

      const cleanup = () => {
        window.removeEventListener('scroll', closeMenu);
        window.removeEventListener('resize', closeMenu);
      };

      const unregisterFn = this.destroyRef.onDestroy(cleanup);

      const menuClosed = this.cdkTrigger.closed.subscribe(() => {
        unregisterFn();
        cleanup();
        menuClosed.unsubscribe();
      });
    }
  }
}
