import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  INJECTOR,
  input,
  runInInjectionContext,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[z-context-menu]',
  host: {
    'data-slot': 'context-menu-trigger',
    '[attr.tabindex]': "'0'",
    '[style.cursor]': "'context-menu'",
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'cdkTrigger.isOpen()',
    '[attr.data-state]': "cdkTrigger.isOpen() ? 'open': 'closed'",
    '(contextmenu)': 'handleContextMenu()',
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
  private readonly elementRef = inject(ElementRef);
  private readonly injector = inject(INJECTOR);

  readonly zContextMenuTriggerFor = input.required<TemplateRef<void>>();

  private lastOpenMethod: 'mouse' | 'keyboard' | '' = '';

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

  protected handleContextMenu(): void {
    this.lastOpenMethod = 'mouse';
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      this.lastOpenMethod = 'keyboard';
      this.open();
    }
  }

  private open(coordinates?: { x: number; y: number }): void {
    const coords = coordinates || this.getDefaultCoordinates();
    this.cdkTrigger.open(coords);

    if (this.lastOpenMethod === 'keyboard') {
      this.focusMenuContent();
    }
  }

  private focusMenuContent(): void {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        const menuContent = document.querySelector('.cdk-overlay-pane [z-menu-content]') as HTMLElement;
        if (menuContent) {
          menuContent.focus();
        }
      });
    });
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

    window.addEventListener('scroll', closeMenu);
    window.addEventListener('resize', closeMenu);

    const cleanup = () => {
      window.removeEventListener('scroll', closeMenu);
      window.removeEventListener('resize', closeMenu);
    };

    this.destroyRef.onDestroy(cleanup);

    const menuClosed = this.cdkTrigger.closed.subscribe(() => {
      cleanup();
      menuClosed.unsubscribe();
    });
  }
}
