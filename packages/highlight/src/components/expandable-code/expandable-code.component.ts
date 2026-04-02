import { ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'z-expandable-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="relative overflow-hidden" [class.h-[250px]]="!expanded()" [class.h-auto]="expanded()">
      <ng-content />
      @if (!expanded()) {
        <div
          class="from-background via-background/95 to-background/30 absolute inset-0 top-10 z-10 flex items-end justify-center bg-gradient-to-t pb-8"
        >
          <button
            type="button"
            class="bg-secondary hover:bg-muted focus-visible:ring-ring flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            (click)="expanded.set(true)"
          >
            {{ title() }}
          </button>
        </div>
      }
    </div>
  `,
})
export class ExpandableCodeComponent {
  readonly title = input('View Code');
  readonly expanded = signal(false);
}
