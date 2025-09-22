

```angular-ts title="resizable.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { resizableVariants, ZardResizableVariants } from './resizable.variants';

export interface ZardResizeEvent {
  sizes: number[];
  layout: 'horizontal' | 'vertical';
}

@Component({
  selector: 'z-resizable',
  exportAs: 'zResizable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '[attr.data-layout]': 'zLayout()',
  },
})
export class ZardResizableComponent implements AfterContentInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private listeners: (() => void)[] = [];

  readonly zLayout = input<ZardResizableVariants['zLayout']>('horizontal');
  readonly zLazy = input(false, { transform });
  readonly class = input<ClassValue>('');

  @Output() readonly zResizeStart = new EventEmitter<ZardResizeEvent>();
  @Output() readonly zResize = new EventEmitter<ZardResizeEvent>();
  @Output() readonly zResizeEnd = new EventEmitter<ZardResizeEvent>();

  readonly panels = contentChildren(ZardResizablePanelComponent);
  readonly panelSizes = signal<number[]>([]);
  protected readonly isResizing = signal(false);
  protected readonly activeHandleIndex = signal<number | null>(null);

  protected readonly classes = computed(() => mergeClasses(resizableVariants({ zLayout: this.zLayout() }), this.class()));

  ngAfterContentInit(): void {
    this.initializePanelSizes();
  }

  convertToPercentage(value: number | string, containerSize: number): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      if (value.endsWith('%')) {
        return parseFloat(value);
      }
      if (value.endsWith('px')) {
        const pixels = parseFloat(value);
        return (pixels / containerSize) * 100;
      }
    }

    return parseFloat(value.toString()) || 0;
  }

  private initializePanelSizes(): void {
    const panels = this.panels();
    const totalPanels = panels.length;

    if (totalPanels === 0) return;

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
    this.zResizeStart.emit({ sizes, layout: this.zLayout() || 'horizontal' });

    const startPosition = this.getEventPosition(event);
    const startSizes = [...sizes];

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      this.handleResize(moveEvent, handleIndex, startPosition, startSizes);
    };

    const handleEnd = () => {
      this.endResize();
      if (isPlatformBrowser(this.platformId)) {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
      }
    };

    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);

      this.listeners.push(() => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
      });
    }
  }

  private handleResize(event: MouseEvent | TouchEvent, handleIndex: number, startPosition: number, startSizes: number[]): void {
    const currentPosition = this.getEventPosition(event);
    const delta = currentPosition - startPosition;
    const containerSize = this.getContainerSize();
    const deltaPercentage = (delta / containerSize) * 100;

    const newSizes = [...startSizes];
    const panels = this.panels();

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) return;

    const leftMin = this.convertToPercentage(leftPanel.zMin() || 0, containerSize);
    const leftMax = this.convertToPercentage(leftPanel.zMax() || 100, containerSize);
    const rightMin = this.convertToPercentage(rightPanel.zMin() || 0, containerSize);
    const rightMax = this.convertToPercentage(rightPanel.zMax() || 100, containerSize);

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

      this.zResize.emit({ sizes: newSizes, layout: this.zLayout() || 'horizontal' });
    }
  }

  private endResize(): void {
    this.isResizing.set(false);
    this.activeHandleIndex.set(null);

    if (this.zLazy()) {
      this.updatePanelStyles();
    }

    const sizes = [...this.panelSizes()];
    this.zResizeEnd.emit({ sizes, layout: this.zLayout() || 'horizontal' });
  }

  updatePanelStyles(): void {
    const panels = this.panels();
    const sizes = this.panelSizes();
    const layout = this.zLayout();

    panels.forEach((panel, index) => {
      const size = sizes[index];
      if (size !== undefined) {
        const element = panel.elementRef.nativeElement as HTMLElement;
        if (layout === 'vertical') {
          element.style.height = `${size}%`;
          element.style.width = '100%';
        } else {
          element.style.width = `${size}%`;
          element.style.height = '100%';
        }
      }
    });
  }

  private getEventPosition(event: MouseEvent | TouchEvent): number {
    const layout = this.zLayout();
    if (event instanceof MouseEvent) {
      return layout === 'vertical' ? event.clientY : event.clientX;
    } else {
      const touch = event.touches[0];
      return layout === 'vertical' ? touch.clientY : touch.clientX;
    }
  }

  getContainerSize(): number {
    const element = this.elementRef.nativeElement as HTMLElement;
    const layout = this.zLayout();
    return layout === 'vertical' ? element.offsetHeight : element.offsetWidth;
  }

  collapsePanel(index: number): void {
    const panels = this.panels();
    const panel = panels[index];

    if (!panel || !panel.zCollapsible()) return;

    const sizes = [...this.panelSizes()];
    const isCollapsed = sizes[index] === 0;

    if (isCollapsed) {
      const containerSize = this.getContainerSize();
      const defaultSize = this.convertToPercentage(panel.zDefaultSize() || 100 / panels.length, containerSize);
      sizes[index] = defaultSize;

      const totalOthers = sizes.reduce((sum, size, i) => (i !== index ? sum + size : sum), 0);
      const scale = (100 - defaultSize) / totalOthers;

      sizes.forEach((size, i) => {
        if (i !== index) {
          sizes[i] = size * scale;
        }
      });
    } else {
      const collapsedSize = sizes[index];
      sizes[index] = 0;

      const totalOthers = sizes.reduce((sum, size, i) => (i !== index ? sum + size : sum), 0);
      const scale = (totalOthers + collapsedSize) / totalOthers;

      sizes.forEach((size, i) => {
        if (i !== index) {
          sizes[i] = size * scale;
        }
      });
    }

    this.panelSizes.set(sizes);
    this.updatePanelStyles();
    this.zResize.emit({ sizes, layout: this.zLayout() || 'horizontal' });
  }

  ngOnDestroy(): void {
    this.listeners.forEach(cleanup => cleanup());
  }
}

```



```angular-ts title="resizable.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

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
        horizontal: 'w-[1px] min-w-[1px] cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2',
        vertical: 'h-[1px] min-h-[1px] w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-4 after:-translate-y-1/2',
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

export const resizableHandleIndicatorVariants = cva('absolute z-10 bg-muted-foreground/30 transition-colors group-hover:bg-muted-foreground/50 rounded-full', {
  variants: {
    zLayout: {
      vertical: 'w-8 h-px',
      horizontal: 'w-px h-8',
    },
  },
  defaultVariants: {
    zLayout: 'horizontal',
  },
});

export type ZardResizableVariants = VariantProps<typeof resizableVariants>;
export type ZardResizablePanelVariants = VariantProps<typeof resizablePanelVariants>;
export type ZardResizableHandleVariants = VariantProps<typeof resizableHandleVariants>;

```



```angular-ts title="index.ts" copyButton showLineNumbers
export * from './resizable.component';
export * from './resizable-panel.component';
export * from './resizable-handle.component';
export * from './resizable.variants';

```



```angular-ts title="resizable-handle.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardResizableComponent } from './resizable.component';
import { resizableHandleIndicatorVariants, resizableHandleVariants } from './resizable.variants';

@Component({
  selector: 'z-resizable-handle',
  exportAs: 'zResizableHandle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zWithHandle()) {
      <div [class]="handleClasses()"></div>
    }
  `,
  host: {
    '[class]': 'classes()',
    '[attr.data-layout]': 'layout()',
    '[attr.tabindex]': 'zDisabled() ? null : 0',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'layout() === "vertical" ? "horizontal" : "vertical"',
    '[attr.aria-disabled]': 'zDisabled()',
    '(mousedown)': 'handleMouseDown($event)',
    '(touchstart)': 'handleTouchStart($event)',
    '(keydown)': 'handleKeyDown($event)',
  },
})
export class ZardResizableHandleComponent {
  private readonly resizable = inject(ZardResizableComponent, { optional: true });

  readonly zWithHandle = input(false, { transform });
  readonly zDisabled = input(false, { transform });
  readonly zHandleIndex = input<number>(0);
  readonly class = input<ClassValue>('');

  protected readonly layout = computed(() => this.resizable?.zLayout() || 'horizontal');

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
    if (this.zDisabled() || !this.resizable) return;
    this.resizable.startResize(this.zHandleIndex(), event);
  }

  handleTouchStart(event: TouchEvent): void {
    if (this.zDisabled() || !this.resizable) return;
    this.resizable.startResize(this.zHandleIndex(), event);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.zDisabled() || !this.resizable) return;

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const layout = this.layout();

    let delta = 0;
    const step = event.shiftKey ? 10 : 1;

    switch (event.key) {
      case 'ArrowLeft':
        if (layout === 'horizontal') delta = -step;
        break;
      case 'ArrowRight':
        if (layout === 'horizontal') delta = step;
        break;
      case 'ArrowUp':
        if (layout === 'vertical') delta = -step;
        break;
      case 'ArrowDown':
        if (layout === 'vertical') delta = step;
        break;
      case 'Home':
        event.preventDefault();
        this.moveToExtreme(true);
        return;
      case 'End':
        event.preventDefault();
        this.moveToExtreme(false);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (panels[handleIndex]?.zCollapsible() || panels[handleIndex + 1]?.zCollapsible()) {
          const collapsibleIndex = panels[handleIndex]?.zCollapsible() ? handleIndex : handleIndex + 1;
          this.resizable.collapsePanel(collapsibleIndex);
        }
        return;
      default:
        return;
    }

    if (delta !== 0) {
      event.preventDefault();
      this.adjustSizes(delta);
    }
  }

  private adjustSizes(delta: number): void {
    if (!this.resizable) return;

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const sizes = [...this.resizable.panelSizes()];

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) return;

    const containerSize = this.resizable.getContainerSize();
    const leftMin = this.resizable.convertToPercentage(leftPanel.zMin() || 0, containerSize);
    const leftMax = this.resizable.convertToPercentage(leftPanel.zMax() || 100, containerSize);
    const rightMin = this.resizable.convertToPercentage(rightPanel.zMin() || 0, containerSize);
    const rightMax = this.resizable.convertToPercentage(rightPanel.zMax() || 100, containerSize);

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
        layout: this.resizable.zLayout() || 'horizontal',
      });
    }
  }

  private moveToExtreme(toMin: boolean): void {
    if (!this.resizable) return;

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const sizes = [...this.resizable.panelSizes()];

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) return;

    const containerSize = this.resizable.getContainerSize();
    const leftMin = this.resizable.convertToPercentage(leftPanel.zMin() || 0, containerSize);
    const leftMax = this.resizable.convertToPercentage(leftPanel.zMax() || 100, containerSize);
    const rightMin = this.resizable.convertToPercentage(rightPanel.zMin() || 0, containerSize);
    const rightMax = this.resizable.convertToPercentage(rightPanel.zMax() || 100, containerSize);

    const totalSize = sizes[handleIndex] + sizes[handleIndex + 1];

    if (toMin) {
      sizes[handleIndex] = leftMin;
      sizes[handleIndex + 1] = Math.min(totalSize - leftMin, rightMax);
    } else {
      sizes[handleIndex] = Math.min(totalSize - rightMin, leftMax);
      sizes[handleIndex + 1] = rightMin;
    }

    this.resizable['panelSizes'].set(sizes);
    this.resizable['updatePanelStyles']();
    this.resizable.zResize.emit({
      sizes,
      layout: this.resizable.zLayout() || 'horizontal',
    });
  }
}

```



```angular-ts title="resizable-panel.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { resizablePanelVariants } from './resizable.variants';

@Component({
  selector: 'z-resizable-panel',
  exportAs: 'zResizablePanel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '[attr.data-collapsed]': 'isCollapsed()',
  },
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
    const width = parseFloat(element.style.width || '0');
    const height = parseFloat(element.style.height || '0');
    return width === 0 || height === 0;
  });

  protected readonly classes = computed(() => mergeClasses(resizablePanelVariants({ zCollapsed: this.isCollapsed() }), this.class()));
}

```

