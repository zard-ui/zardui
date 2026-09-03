import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-basic',
  imports: [ZardCollapsibleImports, ZardButtonComponent, ZardCardImports, NgIcon],
  template: `
    <z-card class="w-full max-w-sm">
      <div z-card-content>
        <z-collapsible class="data-[state=open]:bg-muted flex flex-col gap-1 rounded-lg p-1 transition-colors">
          <button z-button z-collapsible-trigger zType="ghost" class="group w-full justify-between">
            Product details
            <ng-icon name="lucideChevronDown" class="transition-transform group-data-[state=open]:rotate-180" />
          </button>

          <z-collapsible-content>
            <div class="flex flex-col gap-2 px-2 pt-1 pb-2">
              <p class="text-muted-foreground text-sm">
                This panel can be expanded or collapsed to reveal additional content.
              </p>
              <button z-button zType="outline" zSize="xs" class="w-fit">Learn More</button>
            </div>
          </z-collapsible-content>
        </z-collapsible>
      </div>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoCollapsibleBasicComponent {}
