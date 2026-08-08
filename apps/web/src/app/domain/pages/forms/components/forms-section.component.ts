import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A `##`-level section of a form guide: heading, optional lead paragraph and
 * projected content. Keeps the three guide pages free of repeated heading class
 * strings.
 *
 * The anchor lives on the host element (`scrollSpyItem` + `id`) so it stays a
 * content child of `<z-content scrollSpy>` — the scroll-spy directive only sees
 * projected content, never a child component's own view.
 */
@Component({
  selector: 'z-forms-section',
  template: `
    <h2 class="font-heading mt-8 scroll-m-28 text-2xl font-medium tracking-tight first:mt-0 lg:mt-12">
      {{ heading() }}
    </h2>
    @if (lead(); as text) {
      <p class="text-muted-foreground leading-relaxed">{{ text }}</p>
    }
    <ng-content />
  `,
  host: { class: 'flex flex-col gap-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsSectionComponent {
  readonly heading = input.required<string>();
  readonly lead = input<string>();
}
