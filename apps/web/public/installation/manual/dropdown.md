

```angular-ts title="dropdown.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { dropdownContentVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu',
  imports: [OverlayModule],
  template: `
    <!-- Dropdown Trigger -->
    <div class="trigger-container" (click)="toggle()" (keydown.{enter,space}.prevent)="toggle()" tabindex="0">
      <ng-content select="[dropdown-trigger]" />
    </div>

    <!-- Template for overlay content -->
    <ng-template #dropdownTemplate>
      <div
        [class]="contentClasses()"
        role="menu"
        [attr.data-state]="'open'"
        (keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent)="onDropdownKeydown($event)"
        tabindex="-1"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'relative inline-block text-left',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '(document:click)': 'onDocumentClick($event)',
  },
  exportAs: 'zDropdownMenu',
})
export class ZardDropdownMenuComponent implements OnDestroy {
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private viewContainerRef = inject(ViewContainerRef);
  private platformId = inject(PLATFORM_ID);

  readonly dropdownTemplate = viewChild.required<TemplateRef<unknown>>('dropdownTemplate');

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly openChange = output<boolean>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));

  ngOnDestroy() {
    this.destroyOverlay();
  }

  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  onDropdownKeydown(e: Event) {
    const items = this.getDropdownItems();
    const { key } = e as KeyboardEvent;

    switch (key) {
      case 'ArrowDown':
        this.navigateItems(1, items);
        break;
      case 'ArrowUp':
        this.navigateItems(-1, items);
        break;
      case 'Enter':
      case ' ':
        this.selectFocusedItem(items);
        break;
      case 'Escape':
        this.close();
        this.focusTrigger();
        break;
      case 'Home':
        this.focusFirstItem(items);
        break;
      case 'End':
        this.focusLastItem(items);
        break;
    }
  }

  toggle() {
    if (this.disabled()) {
      return;
    }
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen()) {
      return;
    }

    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);
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
    if (this.overlayRef) {
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
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
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(
      dropdownElement.querySelectorAll<HTMLElement>('z-dropdown-menu-item, [z-dropdown-menu-item]'),
    ).filter(item => item.dataset['disabled'] === undefined);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) {
      return;
    }

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



```angular-ts title="dropdown.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownContentVariants = cva(
  'bg-popover text-popover-foreground z-50 min-w-50 overflow-y-auto rounded-md border py-1 px-1 shadow-md',
);

export const dropdownItemVariants = cva(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:hover:bg-destructive/20 dark:focus:bg-destructive/20 focus:text-destructive',
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

export type ZardDropdownItemVariants = VariantProps<typeof dropdownItemVariants>;

```



```angular-ts title="dropdown-item.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownItemVariants, type ZardDropdownItemVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-item, [z-dropdown-menu-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() || null',
    '[attr.aria-disabled]': 'disabled()',
    '(click.prevent-with-stop)': 'onClick()',
    role: 'menuitem',
    tabindex: '-1',
  },
  exportAs: 'zDropdownMenuItem',
})
export class ZardDropdownMenuItemComponent {
  private readonly dropdownService = inject(ZardDropdownService);

  readonly variant = input<ZardDropdownItemVariants['variant']>('default');
  readonly inset = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  onClick() {
    if (this.disabled()) {
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



```angular-ts title="dropdown-menu-content.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { dropdownContentVariants } from '@/shared/components/dropdown/dropdown.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-dropdown-menu-content',
  template: `
    <ng-template #contentTemplate>
      <div [class]="contentClasses()" role="menu" tabindex="-1" aria-orientation="vertical">
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"none"',
  },
  exportAs: 'zDropdownMenuContent',
})
export class ZardDropdownMenuContentComponent {
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}

```



```angular-ts title="dropdown-trigger.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Directive, ElementRef, inject, input, type OnInit, ViewContainerRef } from '@angular/core';

import type { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownService } from './dropdown.service';

@Directive({
  selector: '[z-dropdown], [zDropdown]',
  host: {
    '[attr.tabindex]': '0',
    '[attr.role]': '"button"',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'dropdownService.isOpen()',
    '[attr.aria-disabled]': 'zDisabled()',
    '(click.prevent-with-stop)': 'onClick()',
    '(mouseenter)': 'onHoverToggle($event)',
    '(mouseleave)': 'onHoverToggle($event)',
    '(keydown.{enter,space}.prevent-with-stop)': 'toggleDropdown()',
    '(keydown.arrowdown.prevent)': 'openDropdown()',
  },
  exportAs: 'zDropdown',
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

  protected onClick() {
    if (this.zTrigger() !== 'click') {
      return;
    }

    this.toggleDropdown();
  }

  protected onHoverToggle(event: MouseEvent) {
    if (this.zTrigger() !== 'hover' || this.zDisabled()) {
      return;
    }

    if (event.type === 'mouseenter') {
      this.openDropdown();
    } else if (event.type === 'mouseleave') {
      this.closeDropdown();
    }
  }

  protected toggleDropdown() {
    if (this.zDisabled()) {
      return;
    }

    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate(), this.viewContainerRef);
    }
  }

  protected openDropdown() {
    if (this.zDisabled()) {
      return;
    }

    const menuContent = this.zDropdownMenu();
    if (menuContent && !this.dropdownService.isOpen()) {
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate(), this.viewContainerRef);
    }
  }

  protected closeDropdown() {
    this.dropdownService.close();
  }
}

```



```angular-ts title="dropdown.imports.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownDirective } from '@/shared/components/dropdown/dropdown-trigger.directive';
import { ZardDropdownMenuComponent } from '@/shared/components/dropdown/dropdown.component';
import { ZardMenuLabelComponent } from '@/shared/components/menu/menu-label.component';

export const ZardDropdownImports = [
  ZardDropdownMenuComponent,
  ZardDropdownMenuItemComponent,
  ZardMenuLabelComponent,
  ZardDropdownMenuContentComponent,
  ZardDropdownDirective,
] as const;

```



```angular-ts title="dropdown.service.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  type ElementRef,
  inject,
  Injectable,
  PLATFORM_ID,
  type Renderer2,
  RendererFactory2,
  signal,
  type TemplateRef,
  type ViewContainerRef,
} from '@angular/core';

import { filter, type Subscription } from 'rxjs';

import { noopFn } from '@/shared/utils/merge-classes';

@Injectable({
  providedIn: 'root',
})
export class ZardDropdownService {
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly rendererFactory = inject(RendererFactory2);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private triggerElement?: ElementRef;
  private renderer!: Renderer2;
  private readonly focusedIndex = signal<number>(-1);
  private outsideClickSubscription!: Subscription;
  private unlisten: () => void = noopFn;

  readonly isOpen = signal(false);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggle(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerElement, template, viewContainerRef);
    }
  }

  private open(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = triggerElement;
    this.createOverlay(triggerElement);

    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
      this.focusFirstItem();
    }, 0);

    // Close on outside click
    this.outsideClickSubscription = this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !triggerElement.nativeElement.contains(event.target)))
      .subscribe(() => {
        this.close();
      });
    this.isOpen.set(true);
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.focusedIndex.set(-1);
    this.unlisten();
    this.destroyOverlay();
    this.isOpen.set(false);
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
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.outsideClickSubscription?.unsubscribe();
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) {
      return;
    }

    this.unlisten = this.renderer.listen(
      dropdownElement,
      'keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent',
      (event: KeyboardEvent) => {
        const items = this.getDropdownItems();

        switch (event.key) {
          case 'ArrowDown':
            this.navigateItems(1, items);
            break;
          case 'ArrowUp':
            this.navigateItems(-1, items);
            break;
          case 'Enter':
          case ' ':
            this.selectFocusedItem(items);
            break;
          case 'Escape':
            this.close();
            this.triggerElement?.nativeElement.focus();
            break;
          case 'Home':
            this.focusItemAtIndex(items, 0);
            break;
          case 'End':
            this.focusItemAtIndex(items, items.length - 1);
            break;
        }
      },
    );

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(
      dropdownElement.querySelectorAll<HTMLElement>('z-dropdown-menu-item, [z-dropdown-menu-item]'),
    ).filter(item => item.dataset['disabled'] === undefined);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) {
      return;
    }

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
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (index === focusedIndex) {
        item.focus();
        item.dataset['highlighted'] = '';
      } else {
        delete item.dataset['highlighted'];
      }
    }
  }
}

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './dropdown.component';
export * from './dropdown-item.component';
export * from './dropdown-menu-content.component';
export * from './dropdown-trigger.directive';
export * from './dropdown.service';
export * from './dropdown.imports';
export * from './dropdown.variants';

```

