import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover/popover.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-button-group-popover',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardPopoverComponent,
    ZardPopoverDirective,
    ZardTextareaComponent,
    ...ZardFieldImports,
    NgIcon,
  ],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline">
        <ng-icon name="lucideBot" />
        Copilot
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="icon"
        zPopover
        [zContent]="popoverContent"
        zAlign="end"
        aria-label="Open Popover"
      >
        <ng-icon name="lucideChevronDown" />
      </button>
      <ng-template #popoverContent>
        <z-popover class="w-80 rounded-xl p-0 text-sm">
          <div class="border-b px-4 py-3">
            <p class="font-medium">Start a new task with Copilot</p>
            <p class="text-muted-foreground text-sm">Describe your task in natural language.</p>
          </div>
          <div z-field class="p-4">
            <label z-field-label for="task" class="sr-only">Task Description</label>
            <textarea z-textarea id="task" placeholder="I need to..." class="resize-none"></textarea>
            <p z-field-description>Copilot will open a pull request for review.</p>
          </div>
        </z-popover>
      </ng-template>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucideBot, lucideChevronDown })],
})
export class ZardDemoButtonGroupPopoverComponent {}
