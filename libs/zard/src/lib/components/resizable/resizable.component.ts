import { isPlatformBrowser } from '@angular/common';
import {
  type AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  inject,
  input,
  type OnDestroy,
  Output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardResizablePanelComponent } from './resizable-panel.component';
import { resizableVariants, type ZardResizableVariants } from './resizable.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

export interface ZardResizeEvent {
  sizes: number[];
  layout: 'horizontal' | 'vertical';
}

type CleanupFunction = () => void;

@Component({
  selector: 'z-resizable, [z-resizable]',
  standalone: true,
  template: `<ng-content />`,
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

  @Output() readonly zResizeStart = new EventEmitter<ZardResizeEvent>();
  @Output() readonly zResize = new EventEmitter<ZardResizeEvent>();
  @Output() readonly zResizeEnd = new EventEmitter<ZardResizeEvent>();

  readonly panels = contentChildren(ZardResizablePanelComponent);
  readonly panelSizes = signal<number[]>([]);
  protected readonly isResizing = signal(false);
  protected readonly activeHandleIndex = signal<number | null>(null);
  protected readonly classes = computed(() =>
    mergeClasses(resizableVariants({ zLayout: this.zLayout() }), this.class()),
  );

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

    if (!leftPanel || !rightPanel) return;

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

    if (!panel?.zCollapsible()) return;

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
