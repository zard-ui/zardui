import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DOCS_TABLE_CLASS } from '@doc/shared/constants/docs-table.constant';
import { inlineCode } from '@doc/shared/utils/inline-code';

import { ZardTableImports } from '@zard/components/table/table.imports';

export interface UtilsClassRow {
  name: string;
  description: string;
  /** Rendered only when the table is given a `defaultLabel` — the custom-property tables use it. */
  default?: string;
}

/**
 * The class/property reference of a utility page. These utilities have no Angular
 * API, so `z-api-reference` has nothing to describe — this renders the same
 * `z-table` layout against a plain `{ name, description }[]` instead.
 */
@Component({
  selector: 'z-utils-class-table',
  imports: [ZardTableImports],
  template: `
    <div class="my-4 overflow-x-auto rounded-lg border">
      <table z-table [class]="tableClass">
        <thead z-table-header>
          <tr z-table-row>
            <th z-table-head scope="col">{{ nameLabel() }}</th>
            @if (defaultLabel(); as label) {
              <th z-table-head scope="col">{{ label }}</th>
            }
          </tr>
        </thead>
        <tbody z-table-body>
          @for (row of rows(); track row.name) {
            <tr z-table-row>
              <td z-table-cell>
                <code class="text-foreground font-mono text-[13px] font-medium">{{ row.name }}</code>
                <p
                  class="text-muted-foreground api-inline mt-1 text-[13px] leading-relaxed"
                  [innerHTML]="inline(row.description)"
                ></p>
              </td>
              @if (defaultLabel()) {
                <td z-table-cell class="whitespace-nowrap">
                  <code class="text-muted-foreground font-mono text-xs">{{ row.default }}</code>
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

  protected readonly tableClass = DOCS_TABLE_CLASS;
  protected readonly inline = inlineCode;
}
