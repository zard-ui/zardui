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
