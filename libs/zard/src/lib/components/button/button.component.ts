import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, signal, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { buttonVariants, type ZardButtonVariants } from './button.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  exportAs: 'zButton',
  standalone: true,
  imports: [ZardIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zLoading()) {
      <i z-icon zType="loader-circle" class="animate-spin duration-2000"></i>
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'classes()',
    '[attr.data-icon-only]': 'iconOnly() || null',
  },
})
export class ZardButtonComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly zType = input<ZardButtonVariants['zType']>('default');
  readonly zSize = input<ZardButtonVariants['zSize']>('default');
  readonly zShape = input<ZardButtonVariants['zShape']>('default');
  readonly class = input<ClassValue>('');
  readonly zFull = input(false, { transform });
  readonly zLoading = input(false, { transform });

  private readonly iconOnlyState = signal(false);
  readonly iconOnly = this.iconOnlyState.asReadonly();

  constructor() {
    afterNextRender(() => {
      const check = () => {
        const el = this.elementRef.nativeElement;
        const hasIcon = el.querySelector('z-icon, [z-icon]') !== null;
        const children = Array.from(el.childNodes) as Node[];
        const hasText = children.some(node => {
          if (node.nodeType === 3) {
            return node.textContent?.trim() !== '';
          }
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            if (element.matches('z-icon, [z-icon]')) return false;
            return element.textContent?.trim() !== '';
          }
          return false;
        });

        this.iconOnlyState.set(hasIcon && !hasText);
      };

      check();
      new MutationObserver(check).observe(this.elementRef.nativeElement, { childList: true, characterData: true, subtree: true });
    });
  }

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zFull: this.zFull(),
        zLoading: this.zLoading(),
      }),
      this.class(),
    ),
  );
}
