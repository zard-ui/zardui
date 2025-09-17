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
