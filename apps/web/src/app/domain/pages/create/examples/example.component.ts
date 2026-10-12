import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '@zard/utils/merge-classes';

/**
 * The page of one component's examples in the `/create` preview, the same grid shadcn/ui's `ExampleWrapper` draws:
 * two columns on a muted background, centred, at least one screen tall.
 */
@Component({
  selector: 'z-example-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'block w-full bg-muted dark:bg-background' },
  template: `
    <div data-slot="example-wrapper" [class]="classes()">
      <ng-content />
    </div>
  `,
})
export class ExampleWrapperComponent {
  /** Classes for the grid itself, e.g. `lg:grid-cols-1` for a page of wide examples. */
  readonly zClass = input('');

  protected readonly classes = computed(() =>
    mergeClasses(
      'mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl',
      this.zClass(),
    ),
  );
}

/** One titled example: a small muted label above a card that holds the demo. shadcn/ui's `Example`. */
@Component({
  selector: 'z-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'example', '[class]': 'containerClasses()' },
  template: `
    @if (zTitle()) {
      <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">{{ zTitle() }}</div>
    }
    <div data-slot="example-content" [class]="contentClasses()">
      <ng-content />
    </div>
  `,
})
export class ExampleComponent {
  readonly zTitle = input('');
  /** Classes for the card (shadcn's `className`). */
  readonly zClass = input('');
  /** Classes for the outer column (shadcn's `containerClassName`). */
  readonly zContainerClass = input('');

  protected readonly containerClasses = computed(() =>
    mergeClasses(
      'mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none',
      this.zContainerClass(),
    ),
  );

  protected readonly contentClasses = computed(() =>
    mergeClasses(
      "bg-card text-foreground style-lyra:rounded-none style-sera:rounded-none flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl p-12 *:[div:not([class*='w-'])]:w-full",
      this.zClass(),
    ),
  );
}

export const ExampleImports = [ExampleWrapperComponent, ExampleComponent] as const;
