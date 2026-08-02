import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MIGRATION_ROWS, OKLCH_REASONS } from '../../data/migration.data';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';

@Component({
  selector: 'z-migration-table',
  standalone: true,
  imports: [InlineCodePipe],
  template: `
    <div class="overflow-x-auto rounded-lg border">
      <table class="w-full min-w-160 border-collapse text-left text-sm">
        <caption class="sr-only">Differences between a shadcn Tailwind v3 setup and a ZardUI Tailwind v4 setup</caption>
        <thead class="bg-muted/50">
          <tr>
            <th scope="col" class="px-4 py-2.5 font-medium">Topic</th>
            <th scope="col" class="px-4 py-2.5 font-medium">shadcn · Tailwind v3</th>
            <th scope="col" class="px-4 py-2.5 font-medium">ZardUI · Tailwind v4</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.topic) {
            <tr class="border-t align-top">
              <th scope="row" class="px-4 py-3 font-medium">
                {{ row.topic }}
                <p class="text-muted-foreground mt-1 text-xs font-normal" [innerHTML]="row.note | inlineCode"></p>
              </th>
              <td class="px-4 py-3">
                <code class="text-muted-foreground text-[11px] break-all">{{ row.before }}</code>
              </td>
              <td class="px-4 py-3">
                <code class="text-[11px] break-all">{{ row.after }}</code>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MigrationTableComponent {
  readonly rows = MIGRATION_ROWS;
  readonly reasons = OKLCH_REASONS;
}
