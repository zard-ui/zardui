import { ChangeDetectionStrategy, Component } from '@angular/core';

const LINES = [
  'Resolving dependencies',
  'Fetching registry index',
  'Downloading core',
  'Writing css/zard.css',
  'Writing utils/merge-classes.ts',
  'Linking peer dependencies',
  'Patching components.json',
  'Formatting written files',
  'Verifying the install',
  'Done in 4.21s',
];

@Component({
  selector: 'z-utils-scroll-fade-edges',
  template: `
    <div class="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-t</p>
        <div class="bg-card scroll-fade-t h-56 overflow-y-auto rounded-lg border p-4">
          @for (line of lines; track line) {
            <p class="py-1.5 text-sm">{{ line }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-b</p>
        <div class="bg-card scroll-fade-b h-56 overflow-y-auto rounded-lg border p-4">
          @for (line of lines; track line) {
            <p class="py-1.5 text-sm">{{ line }}</p>
          }
        </div>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeEdgesComponent {
  protected readonly lines = LINES;
}
