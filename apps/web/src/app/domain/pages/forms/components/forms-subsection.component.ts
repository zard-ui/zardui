import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A `###`-level block inside a `z-forms-section`. */
@Component({
  selector: 'z-forms-subsection',
  template: `
    <div class="flex flex-col gap-3">
      <h3 class="mt-4 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">{{ heading() }}</h3>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsSubsectionComponent {
  readonly heading = input.required<string>();
}
