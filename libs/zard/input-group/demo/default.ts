import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardDividerComponent } from '@ngzard/ui/divider';
import { ZardDropdownModule } from '@ngzard/ui/dropdown';
import { ZardIconComponent } from '@ngzard/ui/icon';
import { ZardInputDirective } from '@ngzard/ui/input';
import { ZardTooltipDirective } from '@ngzard/ui/tooltip';

import { ZardInputGroupComponent } from '../input-group.component';

@Component({
  selector: 'z-demo-input-group-default',
  imports: [
    ZardButtonComponent,
    ZardDropdownModule,
    ZardIconComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
    ZardDividerComponent,
    ZardTooltipDirective,
  ],
  template: `
    <div class="flex w-[380px] flex-col space-y-4">
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

    <ng-template #search><z-icon zType="search" /></ng-template>

    <ng-template #check>
      <div class="bg-primary rounded-full p-0.5">
        <z-icon zType="check" class="stroke-primary-foreground" zSize="sm" />
      </div>
    </ng-template>

    <ng-template #info><z-icon zType="info" zTooltip="Element with tooltip" /></ng-template>

    <ng-template #areaAfter>
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-1">
          <button type="button" z-button zType="outline" zShape="circle" class="data-icon-only:size-6!">
            <z-icon zType="plus" />
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
            <z-icon zType="arrow-up" />
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
export class ZardDemoInputGroupDefaultComponent {}
