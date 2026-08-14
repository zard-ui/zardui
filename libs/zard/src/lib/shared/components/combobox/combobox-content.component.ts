import {
  type ConnectedPosition,
  type FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  type OnDestroy,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import {
  comboboxContentVariants,
  comboboxEmptyVariants,
  comboboxListVariants,
  comboboxSeparatorVariants,
} from '@/shared/components/combobox/combobox.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { type ZardComboboxAlignVariants, ZardComboboxRoot, type ZardComboboxSideVariants } from './combobox.types';

@Component({
  selector: 'z-combobox-list, [z-combobox-list]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'listbox',
    'data-slot': 'combobox-list',
    '[attr.aria-multiselectable]': 'root.zMultiple() ? "true" : null',
    '[attr.data-empty]': 'isEmpty() ? "" : null',
    '[class]': 'classes()',
    '[id]': 'root.listboxId',
  },
  exportAs: 'zComboboxList',
})
export class ZardComboboxListComponent {
  protected readonly root = inject(ZardComboboxRoot);

  readonly class = input<ClassValue>('');

  protected readonly isEmpty = computed(() => this.root.visibleItems().length === 0);
  protected readonly classes = computed(() => mergeClasses(comboboxListVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-empty, [z-combobox-empty]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'combobox-empty',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxEmpty',
})
export class ZardComboboxEmptyComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxEmptyVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-separator, [z-combobox-separator]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'separator',
    'aria-orientation': 'horizontal',
    'data-slot': 'combobox-separator',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxSeparator',
})
export class ZardComboboxSeparatorComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxSeparatorVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-content',
  template: `
    <ng-template #popupTemplate>
      <div class="isolate z-50">
        <div
          role="presentation"
          data-slot="combobox-content"
          [attr.data-align]="alignValue()"
          [attr.data-chips]="isChips() ? 'true' : null"
          [attr.data-empty]="isEmpty() ? '' : null"
          [attr.data-side]="resolvedSide()"
          [attr.data-state]="root.open() ? 'open' : 'closed'"
          [class]="popupClasses()"
          [style.--z-combobox-anchor-width]="anchorWidth()"
          [style.--z-combobox-available-height]="availableHeight()"
          [style.--z-combobox-available-width]="availableWidth()"
          [style.--z-combobox-transform-origin]="transformOrigin()"
          (keydown)="root.handleKeydown($event)"
          (mousedown)="onMousedown($event)"
        >
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
    'data-slot': 'combobox-content-anchor',
  },
  exportAs: 'zComboboxContent',
})
export class ZardComboboxContentComponent implements OnDestroy {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly class = input<ClassValue>('');
  readonly zAnchor = input<ElementRef<HTMLElement> | HTMLElement | null>(null);
  readonly zSide = input<ZardComboboxSideVariants | null>(null);
  readonly zAlign = input<ZardComboboxAlignVariants | null>(null);
  readonly zSideOffset = input<number | null, number | string | null | undefined>(null, {
    transform: nullableNumberAttribute,
  });

  readonly zAlignOffset = input<number | null, number | string | null | undefined>(null, {
    transform: nullableNumberAttribute,
  });

  private readonly popupTemplate = viewChild.required<TemplateRef<void>>('popupTemplate');

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private positionStrategy?: FlexibleConnectedPositionStrategy;

  protected readonly resolvedSide = signal<ZardComboboxSideVariants>('bottom');
  protected readonly anchorWidth = signal('0px');
  protected readonly availableWidth = signal('0px');
  protected readonly availableHeight = signal('0px');

  protected readonly sideValue = computed(() => this.zSide() ?? this.root.zSide());
  protected readonly alignValue = computed(() => this.zAlign() ?? this.root.zAlign());
  protected readonly sideOffsetValue = computed(() => this.zSideOffset() ?? this.root.zSideOffset());
  protected readonly alignOffsetValue = computed(() => this.zAlignOffset() ?? this.root.zAlignOffset());

  protected readonly isEmpty = computed(() => this.root.visibleItems().length === 0);
  protected readonly isChips = computed(() => this.zAnchor() !== null || this.root.hasChips());

  protected readonly transformOrigin = computed(() => {
    const block = this.resolvedSide() === 'bottom' ? 'top' : 'bottom';
    const align = this.alignValue();
    const inline = align === 'center' ? 'center' : align === 'start' ? 'left' : 'right';
    return `${block} ${inline}`;
  });

  protected readonly popupClasses = computed(() => mergeClasses(comboboxContentVariants(), this.class()));

  constructor() {
    effect(() => {
      if (this.root.open()) {
        this.attach();
      } else {
        this.detach();
      }
    });
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  private anchor(): HTMLElement | null {
    const own = this.zAnchor();
    if (own) {
      return own instanceof ElementRef ? own.nativeElement : own;
    }
    return this.root.anchorElement();
  }

  private attach(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const anchor = this.anchor();
    if (!anchor) {
      return;
    }

    this.resolvedSide.set(this.sideValue());
    this.createOverlay(anchor);

    if (!this.overlayRef || this.overlayRef.hasAttached()) {
      return;
    }

    this.positionStrategy?.setOrigin(anchor).withPositions(this.connectedPositions());
    this.updateMeasurements();

    this.portal ??= new TemplatePortal(this.popupTemplate(), this.viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.updateMeasurements();
  }

  private detach(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  private createOverlay(anchor: HTMLElement): void {
    if (this.overlayRef) {
      return;
    }

    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(anchor)
      .withPositions(this.connectedPositions())
      .withFlexibleDimensions(false)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.positionStrategy.positionChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(change => {
      this.resolvedSide.set(change.connectionPair.originY === 'top' ? 'top' : 'bottom');
      this.updateMeasurements();
    });

    this.overlayRef
      .outsidePointerEvents()
      .pipe(
        filter(event => !this.isInsideCombobox(event.target)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.root.closePanel());
  }

  private isInsideCombobox(target: EventTarget | null): boolean {
    if (!(target instanceof Node)) {
      return false;
    }

    const anchor = this.anchor();
    return !!anchor?.contains(target);
  }

  private connectedPositions(): ConnectedPosition[] {
    const align = this.alignValue();
    const x = align === 'center' ? 'center' : align === 'end' ? 'end' : 'start';
    const sideOffset = this.sideOffsetValue();
    const alignOffset = this.alignOffsetValue();

    const below: ConnectedPosition = {
      originX: x,
      originY: 'bottom',
      overlayX: x,
      overlayY: 'top',
      offsetX: alignOffset,
      offsetY: sideOffset,
    };
    const above: ConnectedPosition = {
      originX: x,
      originY: 'top',
      overlayX: x,
      overlayY: 'bottom',
      offsetX: alignOffset,
      offsetY: -sideOffset,
    };

    return this.sideValue() === 'top' ? [above, below] : [below, above];
  }

  private updateMeasurements(): void {
    const anchor = this.anchor();
    if (!anchor || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const offset = this.sideOffsetValue();
    const viewportHeight = window.innerHeight || 0;
    const viewportWidth = window.innerWidth || 0;
    const align = this.alignValue();

    const height = this.resolvedSide() === 'bottom' ? viewportHeight - rect.bottom - offset : rect.top - offset;
    const width = align === 'start' ? viewportWidth - rect.left : align === 'end' ? rect.right : viewportWidth;

    this.anchorWidth.set(`${Math.round(anchor.offsetWidth || rect.width)}px`);
    this.availableHeight.set(`${Math.max(Math.round(height), 0)}px`);
    this.availableWidth.set(`${Math.max(Math.round(width), 0)}px`);
  }

  /** Prevents the popup from stealing the focus away from the combobox input. */
  protected onMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}

function nullableNumberAttribute(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return numberAttribute(value);
}
