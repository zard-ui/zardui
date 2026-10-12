import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCircleArrowLeft } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import type { ZardButtonSizeVariants, ZardButtonTypeVariants } from '@zard/components/button/button.variants';

import { ExampleImports } from './example.component';

const SIZES: readonly ZardButtonSizeVariants[] = ['xs', 'sm', 'default', 'lg'];
const ICON_SIZES: readonly ZardButtonSizeVariants[] = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'];
const VARIANTS: readonly { type: ZardButtonTypeVariants; label: string }[] = [
  { type: 'default', label: 'Default' },
  { type: 'secondary', label: 'Secondary' },
  { type: 'outline', label: 'Outline' },
  { type: 'ghost', label: 'Ghost' },
  { type: 'destructive', label: 'Destructive' },
  { type: 'link', label: 'Link' },
];

/** shadcn/ui's `button-example`, in zard. */
@Component({
  selector: 'z-button-example',
  imports: [ExampleImports, ZardButtonComponent, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowRight, lucideCircleArrowLeft })],
  template: `
    <z-example-wrapper zClass="lg:grid-cols-1 2xl:grid-cols-1">
      <z-example zTitle="Variants &amp; Sizes">
        @for (size of sizes; track size) {
          <div class="flex flex-wrap items-center gap-2">
            @for (variant of variants; track variant.type) {
              <button z-button [zSize]="size" [zType]="variant.type">{{ variant.label }}</button>
            }
          </div>
        }
      </z-example>

      <z-example zTitle="Icon Right">
        @for (size of sizes; track size) {
          <div class="flex flex-wrap items-center gap-2">
            @for (variant of variants; track variant.type) {
              <button z-button [zSize]="size" [zType]="variant.type">
                {{ variant.label }}
                <ng-icon name="lucideArrowRight" data-icon="inline-end" />
              </button>
            }
          </div>
        }
      </z-example>

      <z-example zTitle="Icon Left">
        @for (size of sizes; track size) {
          <div class="flex flex-wrap items-center gap-2">
            @for (variant of variants; track variant.type) {
              <button z-button [zSize]="size" [zType]="variant.type">
                <ng-icon name="lucideCircleArrowLeft" data-icon="inline-start" />
                {{ variant.label }}
              </button>
            }
          </div>
        }
      </z-example>

      <z-example zTitle="Icon Only">
        @for (size of iconSizes; track size) {
          <div class="flex flex-wrap items-center gap-2">
            @for (variant of variants; track variant.type) {
              <button z-button [zSize]="size" [zType]="variant.type">
                <ng-icon name="lucideArrowRight" />
              </button>
            }
          </div>
        }
      </z-example>

      <z-example zTitle="Invalid States">
        @for (size of sizes; track size) {
          <div class="flex flex-wrap items-center gap-2">
            @for (variant of variants; track variant.type) {
              <button z-button [zSize]="size" [zType]="variant.type" aria-invalid="true">{{ variant.label }}</button>
            }
          </div>
        }
      </z-example>

      <z-example zTitle="Examples">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <button z-button zType="outline">Cancel</button>
            <button z-button>
              Submit
              <ng-icon name="lucideArrowRight" data-icon="inline-end" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zType="destructive">Delete</button>
            <button z-button zSize="icon">
              <ng-icon name="lucideArrowRight" data-icon="inline-end" />
            </button>
          </div>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ButtonExampleComponent {
  protected readonly sizes = SIZES;
  protected readonly iconSizes = ICON_SIZES;
  protected readonly variants = VARIANTS;
}
