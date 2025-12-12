

```angular-ts title="button.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  type OnDestroy,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  buttonVariants,
  type ZardButtonShapeVariants,
  type ZardButtonSizeVariants,
  type ZardButtonTypeVariants,
} from './button.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  imports: [ZardIconComponent],
  template: `
    @if (zLoading()) {
      <z-icon zType="loader-circle" class="animate-spin duration-2000" />
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-icon-only]': 'iconOnly() || null',
    '[attr.data-disabled]': 'isNotInsideOfButtonOrLink() && zDisabled() || null',
    '[attr.aria-disabled]': 'isNotInsideOfButtonOrLink() && zDisabled() || null',
    '[attr.disabled]': 'isNotInsideOfButtonOrLink() && zDisabled() ? "" : null',
    '[attr.role]': 'isNotInsideOfButtonOrLink() ? "button" : null',
    '[attr.tabindex]': 'isNotInsideOfButtonOrLink() ? "0" : null',
  },
  exportAs: 'zButton',
})
export class ZardButtonComponent implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly zType = input<ZardButtonTypeVariants>('default');
  readonly zSize = input<ZardButtonSizeVariants>('default');
  readonly zShape = input<ZardButtonShapeVariants>('default');
  readonly class = input<ClassValue>('');
  readonly zFull = input(false, { transform: booleanAttribute });
  readonly zLoading = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  private readonly iconOnlyState = signal(false);
  readonly iconOnly = this.iconOnlyState.asReadonly();

  private _mutationObserver: MutationObserver | null = null;

  constructor() {
    afterNextRender(() => {
      const check = () => {
        const el = this.elementRef.nativeElement;
        const hasIcon = el.querySelector('z-icon, [z-icon]') !== null;
        const children = Array.from<Node>(el.childNodes);
        const hasText = children.some(node => {
          if (node.nodeType === 3) {
            return node.textContent?.trim() !== '';
          }
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            if (element.matches('z-icon, [z-icon]')) {
              return false;
            }
            return element.textContent?.trim() !== '';
          }
          return false;
        });

        this.iconOnlyState.set(hasIcon && !hasText);
      };

      check();
      this._mutationObserver = new MutationObserver(check);
      this._mutationObserver.observe(this.elementRef.nativeElement, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
  }

  ngOnDestroy(): void {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
  }

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zFull: this.zFull(),
        zLoading: this.zLoading(),
        zDisabled: this.zDisabled(),
      }),
      this.class(),
    ),
  );

  protected readonly isNotInsideOfButtonOrLink = computed(() => {
    // Evaluated once; assumes component parent doesn't change after mount
    const zardButtonElement = this.elementRef.nativeElement;
    if (zardButtonElement.parentElement) {
      const { tagName } = zardButtonElement.parentElement;
      return tagName !== 'BUTTON' && tagName !== 'A';
    }
    return true;
  });
}

```



```angular-ts title="button.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '../../shared/utils/utils';

export const buttonVariants = cva(
  mergeClasses(
    'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all active:scale-97',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  ),
  {
    variants: {
      zType: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      zSize: {
        default: 'h-9 px-4 py-2 data-icon-only:size-9 data-icon-only:p-0',
        sm: 'h-8 rounded-md gap-1.5 px-3 data-icon-only:size-8 data-icon-only:p-0',
        lg: 'h-10 rounded-md px-6 data-icon-only:size-10 data-icon-only:p-0',
      },
      zShape: {
        default: 'rounded-md',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
      zFull: {
        true: 'w-full',
      },
      zLoading: {
        true: 'opacity-50 pointer-events-none',
      },
      zDisabled: {
        true: 'pointer-events-none opacity-50',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);
export type ZardButtonShapeVariants = NonNullable<VariantProps<typeof buttonVariants>['zShape']>;
export type ZardButtonSizeVariants = NonNullable<VariantProps<typeof buttonVariants>['zSize']>;
export type ZardButtonTypeVariants = NonNullable<VariantProps<typeof buttonVariants>['zType']>;

```

