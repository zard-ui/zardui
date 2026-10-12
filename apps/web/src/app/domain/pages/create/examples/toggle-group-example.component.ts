import { ChangeDetectionStrategy, Component, computed, signal, type TemplateRef, viewChild } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideBold,
  lucideBookmark,
  lucideHeart,
  lucideItalic,
  lucideStar,
  lucideTrendingUp,
  lucideUnderline,
} from '@ng-icons/lucide';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@zard/components/toggle-group/toggle-group.component';

import { ExampleImports } from './example.component';

const FORMATTING: readonly ZardToggleGroupItem[] = [
  { value: 'bold', icon: 'lucideBold', ariaLabel: 'Toggle bold' },
  { value: 'italic', icon: 'lucideItalic', ariaLabel: 'Toggle italic' },
  { value: 'underline', icon: 'lucideUnderline', ariaLabel: 'Toggle underline' },
];

const ALL_MISSED: readonly ZardToggleGroupItem[] = [
  { value: 'all', label: 'All', ariaLabel: 'Toggle all' },
  { value: 'missed', label: 'Missed', ariaLabel: 'Toggle missed' },
];

const POSITIONS: readonly ZardToggleGroupItem[] = [
  { value: 'top', label: 'Top', ariaLabel: 'Toggle top' },
  { value: 'bottom', label: 'Bottom', ariaLabel: 'Toggle bottom' },
  { value: 'left', label: 'Left', ariaLabel: 'Toggle left' },
  { value: 'right', label: 'Right', ariaLabel: 'Toggle right' },
];

const FILTERS: readonly ZardToggleGroupItem[] = [
  { value: 'all', label: 'All', ariaLabel: 'All' },
  { value: 'active', label: 'Active', ariaLabel: 'Active' },
  { value: 'completed', label: 'Completed', ariaLabel: 'Completed' },
  { value: 'archived', label: 'Archived', ariaLabel: 'Archived' },
];

const DATE_RANGES: readonly ZardToggleGroupItem[] = [
  { value: 'today', label: 'Today', ariaLabel: 'Today' },
  { value: 'week', label: 'This Week', ariaLabel: 'This Week' },
  { value: 'month', label: 'This Month', ariaLabel: 'This Month' },
  { value: 'year', label: 'This Year', ariaLabel: 'This Year' },
];

const VIEWS: readonly ZardToggleGroupItem[] = [
  { value: 'grid', label: 'Grid', ariaLabel: 'Grid view' },
  { value: 'list', label: 'List', ariaLabel: 'List view' },
];

const VERTICAL_FILTERS: readonly ZardToggleGroupItem[] = [
  { value: 'all', label: 'All', ariaLabel: 'Toggle all' },
  { value: 'active', label: 'Active', ariaLabel: 'Toggle active' },
  { value: 'completed', label: 'Completed', ariaLabel: 'Toggle completed' },
  { value: 'archived', label: 'Archived', ariaLabel: 'Toggle archived' },
];

/** shadcn/ui's `toggle-group-example`, in zard. */
@Component({
  selector: 'z-toggle-group-example',
  imports: [ExampleImports, ZardFieldImports, ZardInputComponent, ZardSelectImports, ZardToggleGroupComponent, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowDown,
      lucideArrowUp,
      lucideBold,
      lucideBookmark,
      lucideHeart,
      lucideItalic,
      lucideStar,
      lucideTrendingUp,
      lucideUnderline,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-toggle-group zMode="multiple" [zSpacing]="1" [zItems]="formatting" />
      </z-example>

      <z-example zTitle="Outline">
        <z-toggle-group zType="outline" zMode="single" zDefaultValue="all" [zItems]="allMissed" />
      </z-example>

      <z-example zTitle="Outline With Icons">
        <z-toggle-group zType="outline" zMode="multiple" zSize="sm" [zItems]="formatting" />
      </z-example>

      <z-example zTitle="Sizes">
        <div class="flex flex-col gap-4">
          <z-toggle-group zMode="single" zSize="sm" zDefaultValue="top" zType="outline" [zItems]="positions" />
          <z-toggle-group zMode="single" zDefaultValue="top" zType="outline" [zItems]="positions" />
        </div>
      </z-example>

      <z-example zTitle="With Spacing">
        <z-toggle-group zMode="single" zSize="sm" zDefaultValue="top" [zSpacing]="2" [zItems]="positions" />
      </z-example>

      <z-example zTitle="With Icons">
        <z-toggle-group
          zMode="multiple"
          zType="outline"
          zSize="sm"
          zItemClass="aria-pressed:bg-transparent aria-pressed:[&_svg]:fill-foreground aria-pressed:[&_svg]:stroke-foreground"
          [zSpacing]="1"
          [zItems]="withIcons()"
        />
      </z-example>

      <z-example zTitle="Filter">
        <z-toggle-group zMode="single" zDefaultValue="all" zType="outline" zSize="sm" [zItems]="filters" />
      </z-example>

      <z-example zTitle="Date Range">
        <z-toggle-group
          zMode="single"
          zDefaultValue="today"
          zType="outline"
          zSize="sm"
          [zSpacing]="2"
          [zItems]="dateRanges"
        />
      </z-example>

      <z-example zTitle="Sort">
        <z-toggle-group zMode="single" zDefaultValue="newest" zType="outline" zSize="sm" [zItems]="sort()" />
      </z-example>

      <z-example zTitle="With Input and Select">
        <div class="flex items-center gap-2">
          <input z-input type="search" placeholder="Search..." class="flex-1" />
          <z-select class="w-32" zValue="all">
            <z-select-group>
              <z-select-item zValue="all">All</z-select-item>
              <z-select-item zValue="active">Active</z-select-item>
              <z-select-item zValue="archived">Archived</z-select-item>
            </z-select-group>
          </z-select>
          <z-toggle-group zMode="single" zDefaultValue="grid" zType="outline" [zItems]="views" />
        </div>
      </z-example>

      <z-example zTitle="Vertical">
        <z-toggle-group zMode="multiple" zOrientation="vertical" [zSpacing]="2" [zItems]="formatting" />
      </z-example>

      <z-example zTitle="Vertical Outline">
        <z-toggle-group
          zType="outline"
          zMode="single"
          zDefaultValue="all"
          zOrientation="vertical"
          zSize="sm"
          [zItems]="verticalFilters"
        />
      </z-example>

      <z-example zTitle="Vertical Outline With Icons">
        <z-toggle-group zType="outline" zMode="multiple" zOrientation="vertical" zSize="sm" [zItems]="formatting" />
      </z-example>

      <z-example zTitle="Vertical With Spacing">
        <z-toggle-group
          zMode="single"
          zSize="sm"
          zDefaultValue="top"
          zOrientation="vertical"
          [zSpacing]="2"
          [zItems]="positions"
        />
      </z-example>

      <z-example zTitle="Font Weight Selector">
        <div z-field>
          <z-field-label>Font Weight</z-field-label>
          <z-toggle-group
            zMode="single"
            zType="outline"
            zSize="lg"
            zItemClass="flex size-16 flex-col items-center justify-center rounded-xl"
            [zSpacing]="2"
            [zValue]="fontWeight()"
            [zItems]="fontWeights()"
            (valueChange)="fontWeight.set($any($event))"
          />
          <p z-field-description>
            Use
            <code class="bg-muted rounded-md px-1 py-0.5 font-mono">font-{{ fontWeight() }}</code>
            to set the font weight.
          </p>
        </div>
      </z-example>
    </z-example-wrapper>

    <ng-template #star>
      <ng-icon name="lucideStar" data-icon="inline-start" />
      Star
    </ng-template>
    <ng-template #heart>
      <ng-icon name="lucideHeart" data-icon="inline-start" />
      Heart
    </ng-template>
    <ng-template #bookmark>
      <ng-icon name="lucideBookmark" data-icon="inline-start" />
      Bookmark
    </ng-template>

    <ng-template #newest>
      <ng-icon name="lucideArrowDown" data-icon="inline-start" />
      Newest
    </ng-template>
    <ng-template #oldest>
      <ng-icon name="lucideArrowUp" data-icon="inline-start" />
      Oldest
    </ng-template>
    <ng-template #popular>
      <ng-icon name="lucideTrendingUp" data-icon="inline-start" />
      Popular
    </ng-template>

    <ng-template #light>
      <span class="text-2xl leading-none font-light">Aa</span>
      <span class="text-muted-foreground text-xs">Light</span>
    </ng-template>
    <ng-template #normal>
      <span class="text-2xl leading-none font-normal">Aa</span>
      <span class="text-muted-foreground text-xs">Normal</span>
    </ng-template>
    <ng-template #medium>
      <span class="text-2xl leading-none font-medium">Aa</span>
      <span class="text-muted-foreground text-xs">Medium</span>
    </ng-template>
    <ng-template #bold>
      <span class="text-2xl leading-none font-bold">Aa</span>
      <span class="text-muted-foreground text-xs">Bold</span>
    </ng-template>
  `,
})
export class ToggleGroupExampleComponent {
  protected readonly formatting = [...FORMATTING];
  protected readonly allMissed = [...ALL_MISSED];
  protected readonly positions = [...POSITIONS];
  protected readonly filters = [...FILTERS];
  protected readonly dateRanges = [...DATE_RANGES];
  protected readonly views = [...VIEWS];
  protected readonly verticalFilters = [...VERTICAL_FILTERS];

  private readonly star = viewChild<TemplateRef<void>>('star');
  private readonly heart = viewChild<TemplateRef<void>>('heart');
  private readonly bookmark = viewChild<TemplateRef<void>>('bookmark');
  private readonly newest = viewChild<TemplateRef<void>>('newest');
  private readonly oldest = viewChild<TemplateRef<void>>('oldest');
  private readonly popular = viewChild<TemplateRef<void>>('popular');
  private readonly light = viewChild<TemplateRef<void>>('light');
  private readonly normal = viewChild<TemplateRef<void>>('normal');
  private readonly medium = viewChild<TemplateRef<void>>('medium');
  private readonly bold = viewChild<TemplateRef<void>>('bold');

  protected readonly withIcons = computed<ZardToggleGroupItem[]>(() => [
    { value: 'star', template: this.star(), ariaLabel: 'Toggle star' },
    { value: 'heart', template: this.heart(), ariaLabel: 'Toggle heart' },
    { value: 'bookmark', template: this.bookmark(), ariaLabel: 'Toggle bookmark' },
  ]);

  protected readonly sort = computed<ZardToggleGroupItem[]>(() => [
    { value: 'newest', template: this.newest(), ariaLabel: 'Newest' },
    { value: 'oldest', template: this.oldest(), ariaLabel: 'Oldest' },
    { value: 'popular', template: this.popular(), ariaLabel: 'Popular' },
  ]);

  protected readonly fontWeights = computed<ZardToggleGroupItem[]>(() => [
    { value: 'light', template: this.light(), ariaLabel: 'Light' },
    { value: 'normal', template: this.normal(), ariaLabel: 'Normal' },
    { value: 'medium', template: this.medium(), ariaLabel: 'Medium' },
    { value: 'bold', template: this.bold(), ariaLabel: 'Bold' },
  ]);

  protected readonly fontWeight = signal('normal');
}
