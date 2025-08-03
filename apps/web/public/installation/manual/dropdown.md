### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown.component.ts

```angular-ts showLineNumbers
import { CommonModule } from '@angular/common';
import { dropdownContainerVariants, dropdownDropdownVariants, ZardDropdownVariants } from './dropdown.variants';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'z-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="containerClasses()">
      <ng-content select="[dropdown-trigger]"></ng-content>
      <div *ngIf="isOpen()" [class]="dropdownClasses()" role="dropdown">
        <div class="p-1" role="none">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ZardDropdownComponent {
  readonly isOpen = input<boolean>(false);
  readonly zSize = input<ZardDropdownVariants['zSize']>('default');
  readonly zPlacement = input<ZardDropdownVariants['zPlacement']>('bottom-end');

  protected containerClasses = computed(() => dropdownContainerVariants());
  protected dropdownClasses = computed(() =>
    dropdownDropdownVariants({
      zSize: this.zSize(),
      zPlacement: this.zPlacement(),
    }),
  );
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const dropdownContainerVariants = cva('relative inline-block text-left', {
  variants: {},
  defaultVariants: {},
});

export const dropdownDropdownVariants = cva('absolute z-10 mt-2 rounded-md ring-1 bg-white dark:bg-black ring-accent ring-opacity-5 dark:ring-opacity-10 focus:outline-none', {
  variants: {
    zSize: {
      default: 'w-56',
      sm: 'w-48',
      lg: 'w-64',
    },
    zPlacement: {
      'bottom-start': 'origin-top-left left-0',
      'bottom-end': 'origin-top-right right-0',
      'top-start': 'origin-bottom-left bottom-full left-0 mb-2',
      'top-end': 'origin-bottom-right bottom-full right-0 mb-2',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zPlacement: 'bottom-end',
  },
});

export type ZardDropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export type ZardDropdownVariants = VariantProps<typeof dropdownDropdownVariants>;

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown-item.component.ts

```angular-ts showLineNumbers
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="text-gray-700 dark:text-gray-200 block w-full px-4 py-2 rounded-sm text-left text-sm hover:bg-gray-100 dark:hover:bg-accent hover:text-gray-900 dark:hover:text-gray-100"
      role="dropdownItem"
      [class.disabled]="disabled()"
      [disabled]="disabled()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    .disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class ZardDropdownItemComponent {
  disabled = input<boolean>(false);
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown.module.ts

```angular-ts showLineNumbers
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

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown.service.ts

```angular-ts showLineNumbers
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

