import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideArrowUpRight, lucideBadgeCheck } from '@ng-icons/lucide';

import { ZardBadgeComponent, type ZardBadgeTypeVariants } from '@zard/components/badge';
import { ZardSpinnerComponent } from '@zard/components/spinner/spinner.component';

import { ExampleImports } from './example.component';

const VARIANTS: readonly { type: ZardBadgeTypeVariants; label: string }[] = [
  { type: 'default', label: 'Default' },
  { type: 'secondary', label: 'Secondary' },
  { type: 'destructive', label: 'Destructive' },
  { type: 'outline', label: 'Outline' },
  { type: 'ghost', label: 'Ghost' },
  { type: 'link', label: 'Link' },
];

const CUSTOM_COLORS: readonly { label: string; class: string }[] = [
  { label: 'Blue', class: 'bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50' },
  { label: 'Green', class: 'bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50' },
  { label: 'Sky', class: 'bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50' },
  { label: 'Purple', class: 'bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50' },
  { label: 'Blue', class: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  { label: 'Green', class: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' },
  { label: 'Sky', class: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
  { label: 'Purple', class: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  { label: 'Red', class: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' },
];

/** shadcn/ui's `badge-example`, in zard. */
@Component({
  selector: 'z-badge-example',
  imports: [ExampleImports, NgIcon, ZardBadgeComponent, ZardSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowRight, lucideArrowUpRight, lucideBadgeCheck })],
  template: `
    <z-example-wrapper zClass="lg:grid-cols-1">
      <z-example zTitle="Variants">
        <div class="style-sera:gap-6 flex flex-wrap gap-2">
          @for (variant of variants; track variant.type) {
            <z-badge [zType]="variant.type">{{ variant.label }}</z-badge>
          }
        </div>
      </z-example>

      <z-example zTitle="Icon Left" zClass="max-w-fit">
        <div class="style-sera:gap-6 flex flex-wrap gap-2">
          @for (variant of variants; track variant.type) {
            <z-badge [zType]="variant.type">
              <ng-icon name="lucideBadgeCheck" data-icon="inline-start" />
              {{ variant.label }}
            </z-badge>
          }
        </div>
      </z-example>

      <z-example zTitle="Icon Right" zClass="max-w-fit">
        <div class="style-sera:gap-6 flex flex-wrap gap-2">
          @for (variant of variants; track variant.type) {
            <z-badge [zType]="variant.type">
              {{ variant.label }}
              <ng-icon name="lucideArrowRight" data-icon="inline-end" />
            </z-badge>
          }
        </div>
      </z-example>

      <z-example zTitle="With Spinner" zClass="max-w-fit">
        <div class="style-sera:gap-6 flex flex-wrap gap-2">
          @for (variant of variants; track variant.type) {
            <z-badge [zType]="variant.type">
              <z-spinner data-icon="inline-start" />
              {{ variant.label }}
            </z-badge>
          }
        </div>
      </z-example>

      <z-example zTitle="asChild">
        <div class="style-sera:gap-6 flex flex-wrap gap-2">
          @for (variant of variants; track variant.type) {
            <a z-badge href="#" [zType]="variant.type" (click)="$event.preventDefault()">
              Link
              <ng-icon name="lucideArrowUpRight" data-icon="inline-end" />
            </a>
          }
        </div>
      </z-example>

      <z-example zTitle="Long Text">
        <div class="style-sera:gap-6 flex flex-wrap gap-2">
          <z-badge zType="secondary">A badge with a lot of text to see how it wraps</z-badge>
        </div>
      </z-example>

      <z-example zTitle="Custom Colors" zClass="max-w-fit">
        <div class="style-sera:gap-6 flex flex-wrap gap-2">
          @for (color of customColors; track $index) {
            <z-badge [class]="color.class">{{ color.label }}</z-badge>
          }
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class BadgeExampleComponent {
  protected readonly variants = VARIANTS;
  protected readonly customColors = CUSTOM_COLORS;
}
