import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

import type { ApiSection } from './api-reference.types';

@Component({
  selector: 'z-api-reference',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div>
      @for (section of sections(); track section.selector) {
        <p class="text-muted-foreground api-component text-base leading-7 [&:not(:first-child)]:mt-6">
          <span class="component-selector">{{ section.selector }}</span>
          <span class="component-badge component-badge--component">Component</span>
        </p>
        <p class="text-muted-foreground text-base leading-7 [&:not(:first-child)]:mt-6">
          {{ section.description }}
        </p>

        <div
          class="api-table-wrapper--component my-4 overflow-auto rounded-md border [&>table]:overflow-hidden [&>table]:rounded-md"
        >
          <table class="api-table--component w-full caption-bottom text-sm">
            <thead class="[&_tr]:text-primary bg-[oklch(97%_0_0)] dark:bg-[oklch(26.9%_0_0)]">
              <tr class="hover:bg-muted/50 transition-colors">
                <th class="h-12 px-4 text-left align-middle font-medium">Property</th>
                <th class="h-12 px-4 text-left align-middle font-medium">Description</th>
                <th class="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th class="h-12 px-4 text-left align-middle font-medium">Default</th>
              </tr>
            </thead>
            <tbody class="bg-accent/20 [&_tr:last-child]:border-0">
              @for (prop of section.props; track prop.name) {
                <tr class="hover:bg-muted/50 border-b transition-colors">
                  <td
                    class="[&_code]:border-ring [&_code]:bg-accent [&_code]:bg-muted p-4 text-left align-middle font-medium [&_code]:mx-1 [&_code]:rounded [&_code]:rounded-sm [&_code]:border [&_code]:border-none [&_code]:px-2 [&_code]:py-1 [&_code]:font-sans [&_code]:text-xs [&_code]:whitespace-nowrap"
                  >
                    <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {{ prop.name }}
                    </code>
                  </td>
                  <td
                    class="[&_code]:border-ring [&_code]:bg-accent [&_code]:bg-muted p-4 text-left align-middle font-medium [&_code]:mx-1 [&_code]:rounded [&_code]:rounded-sm [&_code]:border [&_code]:border-none [&_code]:px-2 [&_code]:py-1 [&_code]:font-sans [&_code]:text-xs [&_code]:whitespace-nowrap"
                  >
                    {{ prop.description }}
                  </td>
                  <td
                    class="[&_code]:border-ring [&_code]:bg-accent [&_code]:bg-muted p-4 text-left align-middle font-medium [&_code]:mx-1 [&_code]:rounded [&_code]:rounded-sm [&_code]:border [&_code]:border-none [&_code]:px-2 [&_code]:py-1 [&_code]:font-sans [&_code]:text-xs [&_code]:whitespace-nowrap"
                  >
                    <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {{ prop.type }}
                    </code>
                  </td>
                  <td
                    class="[&_code]:border-ring [&_code]:bg-accent [&_code]:bg-muted p-4 text-left align-middle font-medium [&_code]:mx-1 [&_code]:rounded [&_code]:rounded-sm [&_code]:border [&_code]:border-none [&_code]:px-2 [&_code]:py-1 [&_code]:font-sans [&_code]:text-xs [&_code]:whitespace-nowrap"
                  >
                    <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {{ prop.default }}
                    </code>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ApiReferenceComponent {
  readonly sections = input.required<ApiSection[]>();
}
