import { ChangeDetectionStrategy, Component } from '@angular/core';

const CHANGES = [
  'feat(button): add a loading state',
  'fix(select): keep the popover width in sync',
  'docs(cli): document the --overwrite flag',
  'refactor(card): drop the redundant wrapper',
  'fix(dialog): restore focus on close',
  'feat(table): sortable column headers',
  'chore(deps): bump angular to 21.1',
  'fix(tabs): announce the active tab',
  'feat(chart): themed tooltip content',
  'test(input): cover the disabled path',
];

@Component({
  selector: 'z-utils-scroll-fade-per-edge',
  template: `
    <div class="flex w-full max-w-md flex-col gap-2">
      <p class="text-muted-foreground font-mono text-xs">scroll-fade scroll-fade-t-4 scroll-fade-b-16</p>
      <!-- A shallow fade at the top, a deep one at the bottom — one class per edge. -->
      <div class="bg-card scroll-fade scroll-fade-t-4 scroll-fade-b-16 h-72 overflow-y-auto rounded-lg border px-4">
        @for (change of changes; track change) {
          <p class="border-b py-3 font-mono text-xs last:border-0">{{ change }}</p>
        }
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadePerEdgeComponent {
  protected readonly changes = CHANGES;
}
