import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideCheck, lucideInfo, lucidePlus, lucideSearch } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';
import { ZardTooltipDirective } from '@zard/components/tooltip';

@Component({
  selector: 'z-block-input-group-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardInputComponent,
    ZardTextareaComponent,
    ...ZardInputGroupImports,
    NgIcon,
    ZardDividerComponent,
    ZardDropdownImports,
    ZardTooltipDirective,
  ],
  viewProviders: [provideIcons({ lucideSearch, lucideInfo, lucidePlus, lucideArrowUp, lucideCheck })],
  template: `
    <div class="grid w-full max-w-sm gap-6">
      <!-- Search with results -->
      <z-input-group>
        <z-input-group-addon>
          <ng-icon name="lucideSearch" />
        </z-input-group-addon>
        <input z-input aria-label="Search" placeholder="Search..." />
        <z-input-group-addon zAlign="inline-end">
          <span z-input-group-text>12 results</span>
        </z-input-group-addon>
      </z-input-group>

      <!-- URL with info tooltip -->
      <z-input-group>
        <z-input-group-addon>
          <span z-input-group-text>https://</span>
        </z-input-group-addon>
        <input z-input aria-label="Website URL" placeholder="example.com" />
        <z-input-group-addon zAlign="inline-end">
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-sm"
            zShape="circle"
            zTooltip="This is content in a tooltip."
            aria-label="Info"
          >
            <ng-icon name="lucideInfo" />
          </button>
        </z-input-group-addon>
      </z-input-group>

      <!-- Textarea with actions -->
      <z-input-group>
        <textarea z-textarea aria-label="Prompt" placeholder="Ask, Search or Chat..." class="min-h-0"></textarea>
        <z-input-group-addon zAlign="block-end">
          <div class="flex w-full items-center">
            <button type="button" z-button zType="outline" zShape="circle" zSize="icon-sm" aria-label="Add">
              <ng-icon name="lucidePlus" />
            </button>
            <button type="button" z-button zType="ghost" zSize="sm" z-dropdown [zDropdownMenu]="menu">Auto</button>
            <z-dropdown-menu-content #menu="zDropdownMenuContent" class="[--radius:0.95rem]">
              <z-dropdown-menu-item>Auto</z-dropdown-menu-item>
              <z-dropdown-menu-item>Agent</z-dropdown-menu-item>
              <z-dropdown-menu-item>Manual</z-dropdown-menu-item>
            </z-dropdown-menu-content>
            <span class="text-muted-foreground ml-auto text-sm">52% used</span>
            <z-divider zOrientation="vertical" class="mx-2 h-4!" />
            <button type="button" z-button zType="default" zShape="circle" zSize="icon-sm" aria-label="Send">
              <ng-icon name="lucideArrowUp" />
            </button>
          </div>
        </z-input-group-addon>
      </z-input-group>

      <!-- Username with check -->
      <z-input-group>
        <input z-input aria-label="Username" placeholder="@zard_ui" />
        <z-input-group-addon zAlign="inline-end">
          <div class="bg-primary flex size-4 items-center justify-center rounded-full" role="img" aria-label="Verified">
            <ng-icon name="lucideCheck" class="text-primary-foreground size-3" />
          </div>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
})
export class BlockInputGroupStackComponent {}
