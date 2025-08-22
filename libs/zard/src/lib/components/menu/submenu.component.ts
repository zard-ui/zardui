import { ClassValue } from 'class-variance-authority/dist/types';

import { ConnectedOverlayPositionChange, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, input, signal, ViewChild, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { submenuContentVariants, submenuTitleVariants, submenuVariants, ZardSubmenuVariants } from './menu.variants';
import { ZardSubmenuService } from './submenu.service';

@Component({
  selector: 'li[z-submenu]',
  exportAs: 'zSubmenu',
  standalone: true,
  imports: [OverlayModule],
  providers: [ZardSubmenuService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      #titleElement
      [class]="titleClasses()"
      (click)="toggle()"
      (keydown)="onTitleKeydown($event)"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="true"
      [attr.aria-disabled]="zDisabled()"
      [tabindex]="tabIndex()"
      role="menuitem"
    >
      @if (zIcon()) {
        <span [class]="'icon-' + zIcon() + ' mr-2'"></span>
      }
      <span>{{ zTitle() }}</span>
      @if (mode() === 'horizontal') {
        <i class="icon-chevron-down ml-1 transition-transform duration-300 group-data-[state=open]:rotate-180"></i>
      } @else if (mode() !== 'inline') {
        <i class="icon-chevron-right ml-auto transition-transform duration-300" [class.rotate-90]="isOpen()"></i>
      } @else {
        <i class="icon-chevron-right ml-auto transition-transform duration-300" [class.rotate-90]="isOpen()"></i>
      }
    </div>

    @if (mode() === 'inline') {
      <div [class]="contentClasses()" role="menu">
        <ng-content></ng-content>
      </div>
    }

    @if (mode() !== 'inline') {
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="titleElement"
        [cdkConnectedOverlayOpen]="isOpen()"
        [cdkConnectedOverlayPositions]="overlayPositions()"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayViewportMargin]="8"
        (positionChange)="onPositionChange($event)"
      >
        <div [class]="contentClasses()" role="menu" (keydown)="onKeydown($event)" (mouseenter)="onSubmenuMouseEnter()" (mouseleave)="onSubmenuMouseLeave()">
          <ng-content></ng-content>
        </div>
      </ng-template>
    }
  `,
  host: {
    '[attr.data-submenu]': 'true',
    '[class]': 'classes()',
  },
})
export class ZardSubmenuComponent {
  private elementRef = inject(ElementRef);
  private submenuService = inject(ZardSubmenuService);

  @ViewChild('titleElement', { read: ElementRef, static: false }) titleElement?: ElementRef;

  readonly zTitle = input<string>('');
  readonly zIcon = input<string>('');
  readonly zDisabled = input(false, { transform });
  readonly zPopupOffset = input<[number, number]>([0, 0]);
  readonly zLevel = input<number>(1);

  // Use service level if not explicitly set
  readonly effectiveLevel = computed(() => this.zLevel() || this.submenuService.level());

  readonly class = input<ClassValue>('');

  readonly isOpen = signal(false);
  readonly mode = signal<ZardSubmenuVariants['zMode']>('vertical');
  readonly collapsed = signal(false);
  readonly overlayPosition = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
  readonly triggerWidth = signal<number>(0);

  constructor() {
    // Sync service state with component state using effects
    effect(() => {
      this.submenuService.updateMode(this.mode());
    });

    effect(() => {
      const serviceOpen = this.submenuService.isOpen();
      this.isOpen.set(serviceOpen);
    });
  }

  readonly overlayPositions = computed<ConnectedPosition[]>(() => {
    const [offsetX, offsetY] = this.zPopupOffset();

    if (this.mode() === 'horizontal') {
      return this.getHorizontalPositions(offsetX, offsetY);
    } else {
      return this.getVerticalPositions(offsetX, offsetY);
    }
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      submenuVariants({
        zMode: this.mode(),
        zOpen: this.isOpen(),
      }),
      this.class(),
    ),
  );

  protected readonly titleClasses = computed(() =>
    mergeClasses(
      submenuTitleVariants({
        zMode: this.mode(),
        zDisabled: this.zDisabled(),
        zLevel: this.effectiveLevel() as 1 | 2 | 3 | 4,
      }),
    ),
  );

  protected readonly contentClasses = computed(() =>
    mergeClasses(
      submenuContentVariants({
        zMode: this.mode(),
        zOpen: this.isOpen(),
        zCollapsed: this.collapsed(),
        zLevel: this.effectiveLevel() as 1 | 2 | 3 | 4,
      }),
    ),
  );

  protected readonly tabIndex = computed(() => {
    return this.zDisabled() ? -1 : 0;
  });

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleOrOverlayState(true);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleOrOverlayState(false);
    }
  }

  toggle(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.zDisabled()) return;

    this.submenuService.toggleOpen();
  }

  open() {
    if (this.zDisabled()) return;
    this.submenuService.setMouseEnterTitleOrOverlayState(true);
  }

  close() {
    this.submenuService.forceClose();
  }

  setMode(mode: ZardSubmenuVariants['zMode']) {
    this.mode.set(mode);
    if (mode === 'inline') {
      this.close();
    }
  }

  setCollapsed(collapsed: boolean) {
    this.collapsed.set(collapsed);
    if (collapsed && this.mode() === 'inline') {
      this.close();
    }
  }

  onTitleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'ArrowRight':
        if (this.mode() !== 'inline' && !this.isOpen()) {
          event.preventDefault();
          this.open();
        }
        break;
      case 'ArrowLeft':
        if (this.mode() !== 'inline' && this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      this.elementRef.nativeElement.querySelector('[role="menuitem"]')?.focus();
    }
  }

  onSubmenuMouseEnter() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleOrOverlayState(true);
    }
  }

  onSubmenuMouseLeave() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleOrOverlayState(false);
    }
  }

  private getHorizontalPositions(offsetX: number, offsetY: number): ConnectedPosition[] {
    return [
      // Bottom placement (preferred)
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: offsetY || 4,
        offsetX: offsetX || 0,
      },
      // Top placement (fallback)
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -(offsetY || 4),
        offsetX: offsetX || 0,
      },
      // Right alignment bottom
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: offsetY || 4,
        offsetX: offsetX || 0,
      },
      // Right alignment top
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -(offsetY || 4),
        offsetX: offsetX || 0,
      },
    ];
  }

  private getVerticalPositions(offsetX: number, offsetY: number): ConnectedPosition[] {
    return [
      // Right placement (preferred for LTR)
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: offsetX || 4,
        offsetY: offsetY || 0,
      },
      // Left placement (fallback)
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetX: -(offsetX || 4),
        offsetY: offsetY || 0,
      },
      // Right placement center-aligned
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: offsetX || 4,
        offsetY: offsetY || 0,
      },
      // Left placement center-aligned
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -(offsetX || 4),
        offsetY: offsetY || 0,
      },
      // Right placement bottom-aligned
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetX: offsetX || 4,
        offsetY: offsetY || 0,
      },
      // Left placement bottom-aligned
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetX: -(offsetX || 4),
        offsetY: offsetY || 0,
      },
    ];
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    // Determine the actual position based on overlay placement
    const connectionPair = position.connectionPair;

    if (this.mode() === 'horizontal') {
      if (connectionPair.originY === 'bottom') {
        this.overlayPosition.set('bottom');
      } else {
        this.overlayPosition.set('top');
      }
    } else {
      if (connectionPair.originX === 'end') {
        this.overlayPosition.set('right');
      } else {
        this.overlayPosition.set('left');
      }
    }

    // Update trigger width for horizontal menus
    if (this.mode() === 'horizontal' && this.titleElement) {
      this.setTriggerWidth();
    }
  }

  private setTriggerWidth(): void {
    if (this.titleElement?.nativeElement) {
      const width = this.titleElement.nativeElement.offsetWidth;
      this.triggerWidth.set(width);
    }
  }
}
