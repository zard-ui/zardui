

```angular-ts title="dropdown.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { Overlay, OverlayModule, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { dropdownContentVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu',
  exportAs: 'zDropdownMenu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule],
  host: {
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    class: 'relative inline-block text-left',
  },
  template: `
    <!-- Dropdown Trigger -->
    <div class="trigger-container" (click)="toggle()" (keydown.enter)="toggle()" (keydown.space)="toggle()" tabindex="0">
      <ng-content select="[dropdown-trigger]"></ng-content>
    </div>

    <!-- Template for overlay content -->
    <ng-template #dropdownTemplate>
      <div [class]="contentClasses()" role="menu" [attr.data-state]="'open'" (keydown)="onDropdownKeydown($event)" tabindex="-1">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class ZardDropdownMenuComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private viewContainerRef = inject(ViewContainerRef);

  @ViewChild('dropdownTemplate', { static: true }) dropdownTemplate!: TemplateRef<unknown>;

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });

  readonly openChange = output<boolean>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));

  ngOnInit() {
    setTimeout(() => {
      this.createOverlay();
    });
  }

  ngOnDestroy() {
    this.destroyOverlay();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  onDropdownKeydown(event: KeyboardEvent) {
    const items = this.getDropdownItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateItems(1, items);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateItems(-1, items);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectFocusedItem(items);
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.focusTrigger();
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirstItem(items);
        break;
      case 'End':
        event.preventDefault();
        this.focusLastItem(items);
        break;
    }
  }

  toggle() {
    if (this.disabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen()) return;

    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) return;

    this.portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.isOpen.set(true);
    this.openChange.emit(true);

    setTimeout(() => {
      this.focusDropdown();
      this.focusFirstItem(this.getDropdownItems());
    }, 0);
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.openChange.emit(false);
  }

  private createOverlay() {
    if (this.overlayRef) return;

    try {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 4,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -4,
          },
        ])
        .withPush(false);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        minWidth: 200,
        maxHeight: 400,
      });
    } catch (error) {
      console.error('Error creating overlay:', error);
    }
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) return [];
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(dropdownElement.querySelectorAll('z-dropdown-menu-item, [z-dropdown-menu-item]')).filter(
      (item: Element) => !item.hasAttribute('data-disabled'),
    ) as HTMLElement[];
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) return;

    const currentIndex = this.focusedIndex();
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = items.length - 1;
    } else if (nextIndex >= items.length) {
      nextIndex = 0;
    }

    this.focusedIndex.set(nextIndex);
    this.updateItemFocus(items, nextIndex);
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      item.click();
    }
  }

  private focusFirstItem(items: HTMLElement[]) {
    if (items.length > 0) {
      this.focusedIndex.set(0);
      this.updateItemFocus(items, 0);
    }
  }

  private focusLastItem(items: HTMLElement[]) {
    if (items.length > 0) {
      const lastIndex = items.length - 1;
      this.focusedIndex.set(lastIndex);
      this.updateItemFocus(items, lastIndex);
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    items.forEach((item, index) => {
      if (index === focusedIndex) {
        item.focus();
        item.setAttribute('data-highlighted', '');
      } else {
        item.removeAttribute('data-highlighted');
      }
    });
  }

  private focusDropdown() {
    if (this.overlayRef?.hasAttached()) {
      const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
      if (dropdownElement) {
        dropdownElement.focus();
      }
    }
  }

  private focusTrigger() {
    const trigger = this.elementRef.nativeElement.querySelector('.trigger-container');
    if (trigger) {
      trigger.focus();
    }
  }
}

```



```angular-ts title="dropdown.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const dropdownContentVariants = cva('bg-popover text-popover-foreground z-50 min-w-[200px] overflow-y-auto rounded-md border py-1 px-1 shadow-md');

export const dropdownItemVariants = cva(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:hover:bg-destructive/20 dark:focus:bg-destructive/20 focus:text-destructive',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  },
);

export const dropdownLabelVariants = cva('relative flex items-center px-2 py-1.5 text-sm font-medium text-muted-foreground', {
  variants: {
    inset: {
      true: 'pl-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const dropdownShortcutVariants = cva('ml-auto text-xs tracking-widest text-muted-foreground');

export type ZardDropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
export type ZardDropdownLabelVariants = VariantProps<typeof dropdownLabelVariants>;

```



```angular-ts title="dropdown-item.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { Component, computed, HostListener, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardDropdownService } from './dropdown.service';
import { dropdownItemVariants, ZardDropdownItemVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-item, [z-dropdown-menu-item]',
  exportAs: 'zDropdownMenuItem',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() || null',
    '[attr.aria-disabled]': 'disabled()',
    role: 'menuitem',
    tabindex: '-1',
  },
})
export class ZardDropdownMenuItemComponent {
  private dropdownService = inject(ZardDropdownService);

  readonly variant = input<ZardDropdownItemVariants['variant']>('default');
  readonly inset = input(false, { transform });
  readonly disabled = input(false, { transform });
  readonly class = input<ClassValue>('');

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Fechar dropdown após click
    setTimeout(() => {
      this.dropdownService.close();
    }, 0);
  }

  protected readonly classes = computed(() =>
    mergeClasses(
      dropdownItemVariants({
        variant: this.variant(),
        inset: this.inset(),
      }),
      this.class(),
    ),
  );
}

```



```angular-ts title="dropdown-label.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { dropdownLabelVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-label, [z-dropdown-menu-label]',
  exportAs: 'zDropdownMenuLabel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '[attr.data-inset]': 'inset() || null',
  },
})
export class ZardDropdownMenuLabelComponent {
  readonly inset = input(false, { transform });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      dropdownLabelVariants({
        inset: this.inset(),
      }),
      this.class(),
    ),
  );
}

```



```angular-ts title="dropdown-menu-content.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { Component, computed, input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { dropdownContentVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-content',
  exportAs: 'zDropdownMenuContent',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #contentTemplate>
      <div [class]="contentClasses()" role="menu" tabindex="-1" [attr.aria-orientation]="'vertical'">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class ZardDropdownMenuContentComponent {
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<unknown>;

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}

```



```angular-ts title="dropdown-shortcut.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { dropdownShortcutVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-shortcut, [z-dropdown-menu-shortcut]',
  exportAs: 'zDropdownMenuShortcut',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDropdownMenuShortcutComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dropdownShortcutVariants(), this.class()));
}

```



```angular-ts title="dropdown-trigger.directive.ts" copyButton showLineNumbers
import { Directive, ElementRef, HostListener, inject, input, OnInit, ViewContainerRef } from '@angular/core';

import { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
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
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private dropdownService = inject(ZardDropdownService);

  readonly zDropdownMenu = input<ZardDropdownMenuContentComponent>();
  readonly zTrigger = input<'click' | 'hover'>('click');
  readonly zDisabled = input<boolean>(false);

  ngOnInit() {
    // Ensure button has proper accessibility attributes
    const element = this.elementRef.nativeElement;
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', element.textContent?.trim() || 'Open menu');
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.zDisabled() || this.zTrigger() !== 'click') return;

    event.preventDefault();
    event.stopPropagation();

    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate, this.viewContainerRef);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.zDisabled() || this.zTrigger() !== 'hover') return;

    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.open(this.elementRef, menuContent.contentTemplate, this.viewContainerRef);
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
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate, this.viewContainerRef);
    }
  }

  private openDropdown() {
    const menuContent = this.zDropdownMenu();
    if (menuContent && !this.dropdownService.isOpen()) {
      this.dropdownService.open(this.elementRef, menuContent.contentTemplate, this.viewContainerRef);
    }
  }
}

```



```angular-ts title="dropdown.module.ts" copyButton showLineNumbers
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZardDropdownMenuItemComponent } from './dropdown-item.component';
import { ZardDropdownMenuLabelComponent } from './dropdown-label.component';
import { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownMenuShortcutComponent } from './dropdown-shortcut.component';
import { ZardDropdownDirective } from './dropdown-trigger.directive';
import { ZardDropdownMenuComponent } from './dropdown.component';

const DROPDOWN_COMPONENTS = [
  ZardDropdownMenuComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuShortcutComponent,
  ZardDropdownMenuContentComponent,
  ZardDropdownDirective,
];

@NgModule({
  imports: [CommonModule, OverlayModule, ...DROPDOWN_COMPONENTS],
  exports: [...DROPDOWN_COMPONENTS],
})
export class ZardDropdownModule {}

```



```angular-ts title="dropdown.service.ts" copyButton showLineNumbers
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ElementRef, inject, Injectable, signal, TemplateRef, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ZardDropdownService {
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private triggerElement?: ElementRef;
  private focusedIndex = signal<number>(-1);

  readonly isOpen = signal(false);

  toggle(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerElement, template, viewContainerRef);
    }
  }

  open(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = triggerElement;
    this.createOverlay(triggerElement);

    if (!this.overlayRef) return;

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.isOpen.set(true);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
      this.focusFirstItem();
    }, 0);

    // Close on outside click
    this.overlayRef.outsidePointerEvents().subscribe(() => {
      this.close();
    });
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.destroyOverlay();
  }

  private createOverlay(triggerElement: ElementRef) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ])
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: 200,
      maxHeight: 400,
    });
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached()) return;

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) return;

    dropdownElement.addEventListener('keydown', (event: KeyboardEvent) => {
      const items = this.getDropdownItems();

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.navigateItems(1, items);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.navigateItems(-1, items);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.selectFocusedItem(items);
          break;
        case 'Escape':
          event.preventDefault();
          this.close();
          this.triggerElement?.nativeElement.focus();
          break;
        case 'Home':
          event.preventDefault();
          this.focusItemAtIndex(items, 0);
          break;
        case 'End':
          event.preventDefault();
          this.focusItemAtIndex(items, items.length - 1);
          break;
      }
    });

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) return [];
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(dropdownElement.querySelectorAll('z-dropdown-menu-item, [z-dropdown-menu-item]')).filter(
      (item: Element) => !item.hasAttribute('data-disabled'),
    ) as HTMLElement[];
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) return;

    const currentIndex = this.focusedIndex();
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = items.length - 1;
    } else if (nextIndex >= items.length) {
      nextIndex = 0;
    }

    this.focusItemAtIndex(items, nextIndex);
  }

  private focusItemAtIndex(items: HTMLElement[], index: number) {
    if (index >= 0 && index < items.length) {
      this.focusedIndex.set(index);
      this.updateItemFocus(items, index);
    }
  }

  private focusFirstItem() {
    const items = this.getDropdownItems();
    if (items.length > 0) {
      this.focusItemAtIndex(items, 0);
    }
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      item.click();
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    items.forEach((item, index) => {
      if (index === focusedIndex) {
        item.focus();
        item.setAttribute('data-highlighted', '');
      } else {
        item.removeAttribute('data-highlighted');
      }
    });
  }
}

```

