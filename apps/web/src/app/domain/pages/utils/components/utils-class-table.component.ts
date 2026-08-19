import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface UtilsClassRow {
  name: string;
  description: string;
  /** Rendered only when the table is given a `defaultLabel` — the custom-property tables use it. */
  default?: string;
}

/**
 * The class/property reference of a utility page. These utilities have no Angular
 * API, so `z-api-reference` has nothing to describe — this renders the same table
 * markup against a plain `{ name, description }[]` instead.
 */
@Component({
  selector: 'z-utils-class-table',
  template: `
    <div class="my-4 overflow-auto rounded-md border [&>table]:overflow-hidden [&>table]:rounded-md">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&_tr]:text-primary bg-neutral-100 dark:bg-neutral-800">
          <tr class="hover:bg-muted/50 transition-colors">
            <th class="h-12 px-4 text-left align-middle font-medium">{{ nameLabel() }}</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Description</th>
            @if (defaultLabel(); as label) {
              <th class="h-12 px-4 text-left align-middle font-medium">{{ label }}</th>
            }
          </tr>
        </thead>
        <tbody class="bg-accent/20 [&_tr:last-child]:border-0">
          @for (row of rows(); track row.name) {
            <tr class="hover:bg-muted/50 border-b transition-colors">
              <td class="p-4 text-left align-middle font-medium">
                <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono! text-sm font-semibold">
                  {{ row.name }}
                </code>
              </td>
              <td class="p-4 text-left align-middle font-medium">{{ row.description }}</td>
              @if (defaultLabel()) {
                <td class="p-4 text-left align-middle font-medium">
                  <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono! text-sm font-semibold">
                    {{ row.default }}
                  </code>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtilsClassTableComponent {
  readonly rows = input.required<UtilsClassRow[]>();
  readonly nameLabel = input('Class');
  readonly defaultLabel = input<string>();
}
