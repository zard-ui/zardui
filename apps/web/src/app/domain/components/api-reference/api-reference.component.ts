import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { DOCS_TABLE_CLASS } from '@doc/shared/constants/docs-table.constant';
import { inlineCode } from '@doc/shared/utils/inline-code';

import { ZardTableImports } from '@zard/components/table/table.imports';

import type { ApiProp, ApiSection } from './api-reference.types';

const EMPTY_DEFAULTS = new Set(['', '-', '—', 'undefined']);

/** The API reference of a component page: a Prop / Type / Default `z-table` per selector. */
@Component({
  selector: 'z-api-reference',
  imports: [ZardTableImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="flex flex-col gap-10">
      @for (section of sectionsWithGroups(); track section.selector) {
        <section class="flex flex-col gap-3" data-slot="api-section">
          <h3 class="font-mono text-sm font-semibold">{{ section.selector }}</h3>
          @if (section.description) {
            <p
              class="text-muted-foreground api-inline text-sm leading-relaxed"
              [innerHTML]="inline(section.description)"
            ></p>
          }

          @for (group of section.groups; track group.label) {
            @if (group.entries.length) {
              <div class="overflow-x-auto rounded-lg border">
                <table z-table [class]="tableClass" [attr.aria-label]="section.selector + ' ' + group.caption">
                  <thead z-table-header>
                    <tr z-table-row>
                      <th z-table-head scope="col">{{ group.label }}</th>
                      <th z-table-head scope="col" class="hidden sm:table-cell">Type</th>
                      <th z-table-head scope="col" class="hidden sm:table-cell">Default</th>
                    </tr>
                  </thead>
                  <tbody z-table-body>
                    @for (entry of group.entries; track entry.name) {
                      <tr z-table-row>
                        <td z-table-cell class="sm:w-1/2">
                          <code class="text-foreground font-mono text-[13px] font-medium">{{ entry.name }}</code>
                          @if (entry.description) {
                            <p
                              class="text-muted-foreground api-inline mt-1 text-[13px] leading-relaxed"
                              [innerHTML]="inline(entry.description)"
                            ></p>
                          }
                          <dl
                            class="text-muted-foreground mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs sm:hidden"
                          >
                            <dt>Type</dt>
                            <dd class="font-mono break-words">{{ entry.type }}</dd>
                            <dt>Default</dt>
                            <dd class="font-mono">{{ display(entry) }}</dd>
                          </dl>
                        </td>
                        <td z-table-cell class="hidden sm:table-cell">
                          <code class="text-muted-foreground font-mono text-xs break-words">{{ entry.type }}</code>
                        </td>
                        <td z-table-cell class="hidden whitespace-nowrap sm:table-cell">
                          <code class="text-muted-foreground font-mono text-xs">{{ display(entry) }}</code>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          }
        </section>
      }
    </div>
  `,
})
export class ApiReferenceComponent {
  readonly sections = input.required<ApiSection[]>();

  protected readonly tableClass = DOCS_TABLE_CLASS;

  protected readonly sectionsWithGroups = computed(() =>
    this.sections().map(section => ({
      ...section,
      groups: [
        { label: 'Prop', caption: 'inputs', entries: section.props },
        { label: 'Event', caption: 'outputs', entries: section.outputs ?? [] },
      ],
    })),
  );

  protected readonly inline = inlineCode;

  protected display(entry: ApiProp): string {
    return EMPTY_DEFAULTS.has(entry.default.trim()) ? '—' : entry.default;
  }
}
