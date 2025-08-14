import { ClassValue } from 'class-variance-authority/dist/types';

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
