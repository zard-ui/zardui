```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { ZardInputGroupComponent } from '@/shared/components/input-group/input-group.component';
import { ZardTooltipDirective } from '@/shared/components/tooltip';
import {
  zardArrowUpIcon,
  zardCheckIcon,
  zardInfoIcon,
  zardPlusIcon,
  zardSearchIcon,
} from '@/shared/core/icons-registry';

@Component({
  selector: 'z-demo-input-group-default',
  imports: [
    ZardButtonComponent,
    ZardDropdownImports,
    NgIcon,
    ZardInputDirective,
    ZardInputGroupComponent,
    ZardDividerComponent,
    ZardTooltipDirective,
  ],
  template: `
    <div class="flex w-95 flex-col space-y-4">
      <z-input-group [zAddonBefore]="search" zAddonAfter="12 results" class="mb-4">
        <input z-input placeholder="Search..." />
      </z-input-group>

      <z-input-group zAddonBefore="https://" [zAddonAfter]="info" class="mb-4">
        <input z-input placeholder="example.com" />
      </z-input-group>

      <z-input-group class="mb-4" [zAddonAfter]="areaAfter">
        <textarea class="h-30 resize-none" z-input placeholder="Ask, Search or Chat..."></textarea>
      </z-input-group>

      <z-input-group [zAddonAfter]="check">
        <input z-input placeholder="@zardui" />
      </z-input-group>
    </div>

    <ng-template #search><ng-icon name="search" /></ng-template>

    <ng-template #check>
      <div class="bg-primary rounded-full p-0.5">
        <ng-icon name="check" class="stroke-primary-foreground" />
      </div>
    </ng-template>

    <ng-template #info><ng-icon name="info" zTooltip="Element with tooltip" /></ng-template>

    <ng-template #areaAfter>
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-1">
          <button type="button" z-button zType="outline" zShape="circle" class="data-icon-only:size-6!">
            <ng-icon name="plus" />
          </button>
          <button type="button" z-button zType="ghost" class="h-6" z-dropdown [zDropdownMenu]="menu">Auto</button>
          <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-10">
            <z-dropdown-menu-item>Auto</z-dropdown-menu-item>
            <z-dropdown-menu-item>Agent</z-dropdown-menu-item>
            <z-dropdown-menu-item>Manual</z-dropdown-menu-item>
          </z-dropdown-menu-content>
        </div>
        <div class="flex h-auto items-center gap-0">
          <span>52% used</span>
          <z-divider zOrientation="vertical" class="h-4" />
          <button type="button" z-button zType="outline" zShape="circle" class="data-icon-only:size-6!">
            <ng-icon name="arrow-up" />
          </button>
        </div>
      </div>
    </ng-template>
  `,
  viewProviders: [
    provideIcons({
      search: zardSearchIcon,
      check: zardCheckIcon,
      info: zardInfoIcon,
      plus: zardPlusIcon,
      arrowUp: zardArrowUpIcon,
    }),
  ],
})
export class ZardDemoInputGroupDefaultComponent {}

```