import { Directive, ElementRef, HostListener, inject, input, type OnInit, ViewContainerRef } from '@angular/core';

import type { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownService } from './dropdown.service';

@Directive({
  selector: '[z-dropdown], [zDropdown]',
  exportAs: 'zDropdown',
  standalone: true,
  host: {
    '[attr.tabindex]': '0',
    '[attr.role]': '"button"',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'dropdownService.isOpen()',
    '[attr.aria-disabled]': 'zDisabled()',
  },
})
export class ZardDropdownDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly dropdownService = inject(ZardDropdownService);

  readonly zDropdownMenu = input<ZardDropdownMenuContentComponent>();
  readonly zTrigger = input<'click' | 'hover'>('click');
  readonly zDisabled = input<boolean>(false);

  ngOnInit() {
    // Ensure button has proper accessibility attributes
    const element = this.elementRef.nativeElement;
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const label = element.textContent?.trim();
      element.setAttribute('aria-label', label?.length ? label : 'Open menu');
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.zDisabled() || this.zTrigger() !== 'click') return;

    event.preventDefault();
    event.stopPropagation();

    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.toggle(this.elementRef, menuContent?.contentTemplate?.(), this.viewContainerRef);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.zDisabled() || this.zTrigger() !== 'hover') return;

    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.open(this.elementRef, menuContent?.contentTemplate?.(), this.viewContainerRef);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.zDisabled() || this.zTrigger() !== 'hover') return;

    this.dropdownService.close();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.zDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        this.toggleDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.openDropdown();
        break;
      case 'Escape':
        event.preventDefault();
        this.dropdownService.close();
        this.elementRef.nativeElement.focus();
        break;
    }
  }

  private toggleDropdown() {
    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.toggle(this.elementRef, menuContent?.contentTemplate?.(), this.viewContainerRef);
    }
  }

  private openDropdown() {
    const menuContent = this.zDropdownMenu();
    if (menuContent && !this.dropdownService.isOpen()) {
      this.dropdownService.open(this.elementRef, menuContent?.contentTemplate?.(), this.viewContainerRef);
    }
  }
}
