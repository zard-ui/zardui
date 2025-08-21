import { ClassValue } from 'class-variance-authority/dist/types';

import { Directive, ElementRef, HostListener, inject, input, output, computed, signal } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { menuItemVariants, ZardMenuItemVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-item]',
  exportAs: 'zMenuItem',
  standalone: true,
  host: {
    role: 'menuitem',
    '[class]': 'classes()',
    '[attr.aria-selected]': 'zSelected()',
    '[attr.aria-disabled]': 'zDisabled()',
    '[attr.data-key]': 'zKey()',
    '[tabindex]': 'tabIndex()',
  },
})
export class ZardMenuItemDirective {
  private elementRef = inject(ElementRef);

  readonly zKey = input<string>('');
  readonly zDisabled = input(false, { transform });
  readonly zSelected = input(false, { transform });
  readonly zTitle = input<string>('');
  readonly zIcon = input<string>('');
  readonly zLevel = input<ZardMenuItemVariants['zLevel']>(1);

  readonly class = input<ClassValue>('');

  readonly itemClick = output<{ key: string; item: HTMLElement }>();

  private selected = signal(false);
  private mode = signal<ZardMenuItemVariants['zMode']>('vertical');

  protected readonly classes = computed(() =>
    mergeClasses(
      menuItemVariants({
        zMode: this.mode(),
        zSelected: this.selected() || this.zSelected(),
        zDisabled: this.zDisabled(),
        zLevel: this.zLevel(),
      }),
      this.class(),
    ),
  );

  protected readonly tabIndex = computed(() => {
    return this.zDisabled() ? -1 : 0;
  });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.zDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.itemClick.emit({
      key: this.zKey(),
      item: this.elementRef.nativeElement,
    });
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.zDisabled()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    this.onClick(new MouseEvent('click'));
  }

  setSelected(selected: boolean) {
    this.selected.set(selected);
  }

  setMode(mode: ZardMenuItemVariants['zMode']) {
    this.mode.set(mode);
  }

  focus() {
    this.elementRef.nativeElement.focus();
  }

  blur() {
    this.elementRef.nativeElement.blur();
  }
}
