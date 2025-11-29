

```angular-ts title="resizable.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { isPlatformBrowser } from '@angular/common';
import {
  type AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardResizablePanelComponent } from './resizable-panel.component';
import { resizableVariants, type ZardResizableVariants } from './resizable.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { checkForProperZardInitialization } from '../core/providezard';

export interface ZardResizeEvent {
  sizes: number[];
  layout: 'horizontal' | 'vertical';
}

type CleanupFunction = () => void;

@Component({
  selector: 'z-resizable, [z-resizable]',
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-layout]': 'zLayout()',
  },
  exportAs: 'zResizable',
})
export class ZardResizableComponent implements AfterContentInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly listenersCleanup: CleanupFunction[] = [];

  readonly zLayout = input<ZardResizableVariants['zLayout']>('horizontal');
  readonly zLazy = input(false, { transform });
  readonly class = input<ClassValue>('');

  readonly zResizeStart = output<ZardResizeEvent>();
  readonly zResize = output<ZardResizeEvent>();
  readonly zResizeEnd = output<ZardResizeEvent>();

  readonly panels = contentChildren(ZardResizablePanelComponent);
  readonly panelSizes = signal<number[]>([]);
  protected readonly isResizing = signal(false);
  protected readonly activeHandleIndex = signal<number | null>(null);
  protected readonly classes = computed(() =>
    mergeClasses(resizableVariants({ zLayout: this.zLayout() }), this.class()),
  );

  constructor() {
    checkForProperZardInitialization();
  }

  ngAfterContentInit(): void {
    this.initializePanelSizes();
  }

  convertToPercentage(value: number | string, containerSize: number): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      if (value.endsWith('%')) {
        return Number.parseFloat(value);
      }
      if (value.endsWith('px')) {
        const pixels = Number.parseFloat(value);

        if (containerSize <= 0) {
          return 0;
        }
        return (pixels / containerSize) * 100;
      }
    }

    return Number.parseFloat(value.toString()) || 0;
  }

  private initializePanelSizes(): void {
    const panels = this.panels();
    const totalPanels = panels.length;

    if (totalPanels === 0) {
      return;
    }

    const containerSize = this.getContainerSize();
    const sizes = panels.map(panel => {
      const defaultSize = panel.zDefaultSize();
      if (defaultSize !== undefined) {
        return this.convertToPercentage(defaultSize, containerSize);
      }
      return 100 / totalPanels;
    });

    this.panelSizes.set(sizes);
    this.updatePanelStyles();
  }

  startResize(handleIndex: number, event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isResizing.set(true);
    this.activeHandleIndex.set(handleIndex);

    const sizes = [...this.panelSizes()];
    this.zResizeStart.emit({ sizes, layout: this.zLayout() ?? 'horizontal' });

    const startPosition = this.getEventPosition(event);
    const startSizes = [...sizes];

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      this.handleResize(moveEvent, handleIndex, startPosition, startSizes);
    };

    const handleEnd = () => {
      this.endResize();
      if (isPlatformBrowser(this.platformId)) {
        this.document.removeEventListener('mousemove', handleMove);
        this.document.removeEventListener('touchmove', handleMove);
        this.document.removeEventListener('mouseup', handleEnd);
        this.document.removeEventListener('touchend', handleEnd);
      }
      this.listenersCleanup.pop();
    };

    if (isPlatformBrowser(this.platformId)) {
      this.document.addEventListener('mousemove', handleMove);
      this.document.addEventListener('touchmove', handleMove);
      this.document.addEventListener('mouseup', handleEnd);
      this.document.addEventListener('touchend', handleEnd);

      this.listenersCleanup.push(() => {
        this.document.removeEventListener('mousemove', handleMove);
        this.document.removeEventListener('touchmove', handleMove);
        this.document.removeEventListener('mouseup', handleEnd);
        this.document.removeEventListener('touchend', handleEnd);
      });
    }
  }

  private handleResize(
    event: MouseEvent | TouchEvent,
    handleIndex: number,
    startPosition: number,
    startSizes: number[],
  ): void {
    const currentPosition = this.getEventPosition(event);
    const delta = currentPosition - startPosition;
    const containerSize = this.getContainerSize();
    const deltaPercentage = (delta / containerSize) * 100;

    const newSizes = [...startSizes];
    const panels = this.panels();

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) {
      return;
    }

    const leftMin = this.convertToPercentage(leftPanel.zMin(), containerSize);
    const leftMax = this.convertToPercentage(leftPanel.zMax(), containerSize);
    const rightMin = this.convertToPercentage(rightPanel.zMin(), containerSize);
    const rightMax = this.convertToPercentage(rightPanel.zMax(), containerSize);

    let newLeftSize = startSizes[handleIndex] + deltaPercentage;
    let newRightSize = startSizes[handleIndex + 1] - deltaPercentage;

    newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
    newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));

    const totalSize = newLeftSize + newRightSize;
    const originalTotal = startSizes[handleIndex] + startSizes[handleIndex + 1];

    if (Math.abs(totalSize - originalTotal) < 0.01) {
      newSizes[handleIndex] = newLeftSize;
      newSizes[handleIndex + 1] = newRightSize;

      this.panelSizes.set(newSizes);

      if (!this.zLazy()) {
        this.updatePanelStyles();
      }

      this.zResize.emit({ sizes: newSizes, layout: this.zLayout() ?? 'horizontal' });
    }
  }

  private endResize(): void {
    this.isResizing.set(false);
    this.activeHandleIndex.set(null);

    if (this.zLazy()) {
      this.updatePanelStyles();
    }

    const sizes = [...this.panelSizes()];
    this.zResizeEnd.emit({ sizes, layout: this.zLayout() ?? 'horizontal' });
  }

  updatePanelStyles(): void {
    const panels = this.panels();
    const sizes = this.panelSizes();
    const layout = this.zLayout();

    for (let index = 0; index < panels.length; index++) {
      const size = sizes[index];
      if (size !== undefined && size !== null) {
        const element = panels[index].elementRef.nativeElement as HTMLElement;
        if (layout === 'vertical') {
          element.style.height = `${size}%`;
          element.style.width = '100%';
        } else {
          element.style.width = `${size}%`;
          element.style.height = '100%';
        }
      }
    }
  }

  private getEventPosition(event: MouseEvent | TouchEvent): number {
    const layout = this.zLayout();
    let position = 0;

    if (event instanceof MouseEvent) {
      position = layout === 'vertical' ? event.clientY : event.clientX;
    } else {
      const touch = event.touches.item(0);
      if (touch) {
        const { clientX, clientY } = touch;
        position = layout === 'vertical' ? clientY : clientX;
      }
    }

    return position;
  }

  getContainerSize(): number {
    const element = this.elementRef.nativeElement as HTMLElement;
    const layout = this.zLayout();
    const { offsetHeight, offsetWidth } = element;
    return layout === 'vertical' ? offsetHeight : offsetWidth;
  }

  // TODO: Consider simplifying collapse logic - handle edge cases where totalOthers is 0 more explicitly
  collapsePanel(index: number): void {
    const panels = this.panels();
    const panel = panels[index];

    if (!panel?.zCollapsible()) {
      return;
    }

    let sizes = [...this.panelSizes()];
    const isCollapsed = sizes[index] === 0;

    if (isCollapsed) {
      const containerSize = this.getContainerSize();
      const defaultSize = this.convertToPercentage(panel.zDefaultSize() ?? 100 / panels.length, containerSize);

      sizes[index] = defaultSize;

      const totalOthers = this.othersTotal(sizes, index);
      if (totalOthers === 0) {
        const share = (100 - defaultSize) / (sizes.length - 1);
        sizes = sizes.map((s, i) => (i === index ? defaultSize : share));
      } else {
        const scale = (100 - defaultSize) / totalOthers;
        sizes = this.scaleSizes(sizes, index, scale);
      }
    } else {
      const collapsedSize = sizes[index];

      sizes[index] = 0;

      const totalOthers = this.othersTotal(sizes, index);
      if (totalOthers === 0) {
        const share = (100 - collapsedSize) / (sizes.length - 1);
        sizes = sizes.map((s, i) => (i === index ? collapsedSize : share));
      } else {
        const scale = (totalOthers + collapsedSize) / totalOthers;
        sizes = this.scaleSizes(sizes, index, scale);
      }
    }

    this.panelSizes.set(sizes);
    this.updatePanelStyles();
    this.zResize.emit({ sizes, layout: this.zLayout() ?? 'horizontal' });
  }

  ngOnDestroy(): void {
    for (const cleanup of this.listenersCleanup) {
      cleanup();
    }
  }

  private scaleSizes(sizes: number[], index: number, scale: number): number[] {
    return sizes.map((size, i) => (i === index ? size : size * scale));
  }

  private othersTotal(sizes: number[], index: number): number {
    return sizes.reduce((sum, size, i) => (i === index ? sum : sum + size), 0);
  }
}

```



```angular-ts title="resizable.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const resizableVariants = cva('flex h-full w-full data-[layout=vertical]:flex-col overflow-hidden', {
  variants: {
    zLayout: {
      horizontal: '',
      vertical: '',
    },
  },
  defaultVariants: {
    zLayout: 'horizontal',
  },
});

export const resizablePanelVariants = cva('relative overflow-hidden flex-shrink-0 h-full', {
  variants: {
    zCollapsed: {
      true: 'hidden',
      false: '',
    },
  },
  defaultVariants: {
    zCollapsed: false,
  },
});

export const resizableHandleVariants = cva(
  'group relative flex flex-shrink-0 items-center justify-center bg-border transition-colors hover:bg-border/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
  {
    variants: {
      zLayout: {
        horizontal:
          'w-[1px] min-w-[1px] cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2',
        vertical:
          'h-[1px] min-h-[1px] w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-4 after:-translate-y-1/2',
      },
      zDisabled: {
        true: 'cursor-default pointer-events-none opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      zLayout: 'horizontal',
      zDisabled: false,
    },
  },
);

export const resizableHandleIndicatorVariants = cva(
  'absolute z-10 bg-muted-foreground/30 transition-colors group-hover:bg-muted-foreground/50 rounded-full',
  {
    variants: {
      zLayout: {
        vertical: 'w-8 h-px',
        horizontal: 'w-px h-8',
      },
    },
    defaultVariants: {
      zLayout: 'horizontal',
    },
  },
);

export type ZardResizableVariants = VariantProps<typeof resizableVariants>;
export type ZardResizablePanelVariants = VariantProps<typeof resizablePanelVariants>;
export type ZardResizableHandleVariants = VariantProps<typeof resizableHandleVariants>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './resizable.component';
export * from './resizable-panel.component';
export * from './resizable-handle.component';
export * from './resizable.variants';

```



```angular-ts title="resizable-handle.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardResizableComponent } from './resizable.component';
import { resizableHandleIndicatorVariants, resizableHandleVariants } from './resizable.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

@Component({
  selector: 'z-resizable-handle, [z-resizable-handle]',
  template: `
    @if (zWithHandle()) {
      <div [class]="handleClasses()"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'separator',
    '[class]': 'classes()',
    '[attr.data-layout]': 'layout()',
    '[attr.tabindex]': 'zDisabled() ? null : 0',
    '[attr.aria-orientation]': 'layout() === "vertical" ? "horizontal" : "vertical"',
    '[attr.aria-disabled]': 'zDisabled()',
    '(mousedown)': 'handleMouseDown($event)',
    '(touchstart)': 'handleTouchStart($event)',
    '(keydown.{arrowleft,arrowright,arrowup,arrowdown,home,end,enter,space}.prevent)': 'handleKeyDown($event)',
  },
  exportAs: 'zResizableHandle',
})
export class ZardResizableHandleComponent {
  private readonly resizable = inject(ZardResizableComponent, { optional: true });

  readonly zWithHandle = input(false, { transform });
  readonly zDisabled = input(false, { transform });
  readonly zHandleIndex = input<number>(0);
  readonly class = input<ClassValue>('');

  protected readonly layout = computed(() => this.resizable?.zLayout() ?? 'horizontal');

  protected readonly classes = computed(() =>
    mergeClasses(
      resizableHandleVariants({
        zLayout: this.layout(),
        zDisabled: this.zDisabled(),
      }),
      this.class(),
    ),
  );

  protected readonly handleClasses = computed(() => resizableHandleIndicatorVariants({ zLayout: this.layout() }));

  handleMouseDown(event: MouseEvent): void {
    if (this.zDisabled() || !this.resizable) {
      return;
    }
    this.resizable.startResize(this.zHandleIndex(), event);
  }

  handleTouchStart(event: TouchEvent): void {
    if (this.zDisabled() || !this.resizable) {
      return;
    }
    this.resizable.startResize(this.zHandleIndex(), event);
  }

  handleKeyDown(event: Event): void {
    if (this.zDisabled() || !this.resizable) {
      return;
    }
    const { key, shiftKey } = event as KeyboardEvent;

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const layout = this.layout();

    let delta = 0;
    const step = shiftKey ? 10 : 1;

    switch (key) {
      case 'ArrowLeft':
        if (layout === 'horizontal') {
          delta = -step;
        }
        break;
      case 'ArrowRight':
        if (layout === 'horizontal') {
          delta = step;
        }
        break;
      case 'ArrowUp':
        if (layout === 'vertical') {
          delta = -step;
        }
        break;
      case 'ArrowDown':
        if (layout === 'vertical') {
          delta = step;
        }
        break;
      case 'Home':
        this.moveToExtreme(true);
        break;
      case 'End':
        this.moveToExtreme(false);
        break;
      case 'Enter':
      case ' ':
        if (panels[handleIndex]?.zCollapsible() || panels[handleIndex + 1]?.zCollapsible()) {
          const collapsibleIndex = panels[handleIndex]?.zCollapsible() ? handleIndex : handleIndex + 1;
          this.resizable.collapsePanel(collapsibleIndex);
        }
        break;
      default:
        break;
    }

    if (delta !== 0) {
      this.adjustSizes(delta);
    }
  }

  private adjustSizes(delta: number): void {
    if (!this.resizable) {
      return;
    }

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const sizes = [...this.resizable.panelSizes()];

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) {
      return;
    }

    const containerSize = this.resizable.getContainerSize();
    const { leftMin, leftMax, rightMin, rightMax } = this.normalizeMinMax(
      this.resizable.convertToPercentage(leftPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(leftPanel.zMax(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMax(), containerSize),
    );

    let newLeftSize = sizes[handleIndex] + delta;
    let newRightSize = sizes[handleIndex + 1] - delta;

    newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
    newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));

    const totalSize = newLeftSize + newRightSize;
    const originalTotal = sizes[handleIndex] + sizes[handleIndex + 1];

    if (Math.abs(totalSize - originalTotal) < 0.01) {
      sizes[handleIndex] = newLeftSize;
      sizes[handleIndex + 1] = newRightSize;

      this.resizable.panelSizes.set(sizes);
      this.resizable.updatePanelStyles();
      this.resizable.zResize.emit({
        sizes,
        layout: this.resizable.zLayout() ?? 'horizontal',
      });
    }
  }

  private moveToExtreme(toMin: boolean): void {
    if (!this.resizable) {
      return;
    }

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const sizes = [...this.resizable.panelSizes()];

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) {
      return;
    }

    const containerSize = this.resizable.getContainerSize();
    const { leftMin, leftMax, rightMin, rightMax } = this.normalizeMinMax(
      this.resizable.convertToPercentage(leftPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(leftPanel.zMax(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMax(), containerSize),
    );

    const totalSize = sizes[handleIndex] + sizes[handleIndex + 1];

    if (toMin) {
      sizes[handleIndex] = leftMin;
      sizes[handleIndex + 1] = Math.min(totalSize - leftMin, rightMax);
    } else {
      sizes[handleIndex] = Math.min(totalSize - rightMin, leftMax);
      sizes[handleIndex + 1] = rightMin;
    }

    this.resizable.panelSizes.set(sizes);
    this.resizable.updatePanelStyles();
    this.resizable.zResize.emit({
      sizes,
      layout: this.resizable.zLayout() ?? 'horizontal',
    });
  }

  private normalizeMinMax(
    leftMin: number,
    leftMax: number,
    rightMin: number,
    rightMax: number,
  ): { leftMin: number; leftMax: number; rightMin: number; rightMax: number } {
    if (leftMax < leftMin) {
      const temp = leftMax;
      leftMax = leftMin;
      leftMin = temp;
    }

    if (rightMax < rightMin) {
      const temp = rightMax;
      rightMax = rightMin;
      rightMin = temp;
    }

    return { leftMin, leftMax, rightMin, rightMax };
  }
}

```



```angular-ts title="resizable-panel.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { resizablePanelVariants } from './resizable.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

@Component({
  selector: 'z-resizable-panel',
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-collapsed]': 'isCollapsed()',
  },
  exportAs: 'zResizablePanel',
})
export class ZardResizablePanelComponent {
  readonly elementRef = inject(ElementRef);

  readonly zDefaultSize = input<number | string | undefined>(undefined);
  readonly zMin = input<number | string>(0);
  readonly zMax = input<number | string>(100);
  readonly zCollapsible = input(false, { transform });
  readonly zResizable = input(true, { transform });
  readonly class = input<ClassValue>('');

  protected readonly isCollapsed = computed(() => {
    const element = this.elementRef.nativeElement as HTMLElement;
    const width = Number.parseFloat(element.style.width || '0');
    const height = Number.parseFloat(element.style.height || '0');
    return width === 0 || height === 0;
  });

  protected readonly classes = computed(() =>
    mergeClasses(resizablePanelVariants({ zCollapsed: this.isCollapsed() }), this.class()),
  );
}

```

