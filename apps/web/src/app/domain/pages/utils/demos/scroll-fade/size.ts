import { ChangeDetectionStrategy, Component } from '@angular/core';

const ROWS = ['Berlin', 'Bogota', 'Cairo', 'Dublin', 'Helsinki', 'Kyoto', 'Lisbon', 'Nairobi', 'Oslo', 'Quito'];

@Component({
  selector: 'z-utils-scroll-fade-size',
  template: `
    <div class="grid w-full max-w-3xl gap-6 sm:grid-cols-3">
      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-4</p>
        <div class="bg-card scroll-fade scroll-fade-4 h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-12</p>
        <div class="bg-card scroll-fade scroll-fade-12 h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-[15%]</p>
        <div class="bg-card scroll-fade scroll-fade-[15%] h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeSizeComponent {
  protected readonly rows = ROWS;
}
