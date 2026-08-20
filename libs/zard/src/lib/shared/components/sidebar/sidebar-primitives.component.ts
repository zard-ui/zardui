import { ChangeDetectionStrategy, Component, computed, Directive, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { separatorVariants } from '@/shared/components/separator/separator.variants';
import {
  sidebarContentVariants,
  sidebarFooterVariants,
  sidebarGroupActionVariants,
  sidebarGroupContentVariants,
  sidebarGroupLabelVariants,
  sidebarGroupVariants,
  sidebarHeaderVariants,
  sidebarSeparatorVariants,
} from '@/shared/components/sidebar/sidebar.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-sidebar-header, [z-sidebar-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-header',
    'data-sidebar': 'header',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarHeader',
})
export class ZardSidebarHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-footer, [z-sidebar-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-footer',
    'data-sidebar': 'footer',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarFooter',
})
export class ZardSidebarFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarFooterVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-content, [z-sidebar-content]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-content',
    'data-sidebar': 'content',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarContent',
})
export class ZardSidebarContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarContentVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-separator',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-separator',
    'data-sidebar': 'separator',
    'data-orientation': 'horizontal',
    role: 'none',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarSeparator',
})
export class ZardSidebarSeparatorComponent {
  readonly class = input<ClassValue>('');

  // `block` mirrors ZardSeparatorComponent: shadcn renders a div, Zard a custom element.
  protected readonly classes = computed(() =>
    mergeClasses(separatorVariants(), 'block', sidebarSeparatorVariants(), this.class()),
  );
}

/**
 * Adds the sidebar look to a Zard input. Used as `<input z-input z-sidebar-input />`.
 *
 * The classes are static host classes rather than a `[class]` binding so they cannot be dropped by
 * the `[class]` binding that `input[z-input]` owns on the same element. Both backgrounds are
 * `!important` because they share their utility group with the input's own `bg-transparent` /
 * `dark:bg-input/30`, and across two separate directives there is no `cn()` to resolve the tie.
 * The dark value repeats the input's own so the result matches shadcn, where `cn()` keeps
 * `dark:bg-input/30` alongside `bg-background` and the dark variant wins in dark mode.
 */
@Directive({
  selector: 'input[z-sidebar-input]',
  host: {
    'data-slot': 'sidebar-input',
    'data-sidebar': 'input',
    class: 'h-8 w-full bg-background! shadow-none dark:bg-input/30!',
  },
  exportAs: 'zSidebarInput',
})
export class ZardSidebarInputDirective {}

@Component({
  selector: 'z-sidebar-group, [z-sidebar-group]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group',
    'data-sidebar': 'group',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroup',
})
export class ZardSidebarGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-group-label, [z-sidebar-group-label]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group-label',
    'data-sidebar': 'group-label',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroupLabel',
})
export class ZardSidebarGroupLabelComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupLabelVariants(), this.class()));
}

@Component({
  selector: 'button[z-sidebar-group-action]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group-action',
    'data-sidebar': 'group-action',
    type: 'button',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroupAction',
})
export class ZardSidebarGroupActionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupActionVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-group-content, [z-sidebar-group-content]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group-content',
    'data-sidebar': 'group-content',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroupContent',
})
export class ZardSidebarGroupContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupContentVariants(), this.class()));
}
