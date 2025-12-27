import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardAvatarGroupComponent } from '@zard/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardDividerComponent } from '@zard/components/divider';
import { ZardDropdownModule } from '@zard/components/dropdown';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import {
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormControlComponent,
} from '@zard/components/form/form.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardSliderComponent } from '@zard/components/slider/slider.component';
import { ZardTooltipDirective } from '@zard/components/tooltip';

@Component({
  selector: 'z-hero-column-2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardEmptyComponent,
    ZardAvatarComponent,
    ZardAvatarGroupComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardInputGroupComponent,
    ZardInputDirective,
    ZardSliderComponent,
    ZardIconComponent,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardFormControlComponent,
    ZardButtonComponent,
    ZardDropdownModule,
    ZardIconComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
    ZardDividerComponent,
    ZardTooltipDirective,
    FormsModule,
  ],
  template: `
    <div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
      <z-empty
        [zImage]="customImage"
        zTitle="No Team Members"
        zDescription="Invite your team to collaborate on this project."
        class="border border-dashed"
      >
        <ng-template #customImage>
          <z-avatar-group class="*:ring-background *:size-12 *:ring-2 *:grayscale">
            <z-avatar zSrc="https://github.com/mikij.png" zAlt="User 4" />
            <z-avatar zSrc="https://github.com/ribeiromatheuss.png" zAlt="User 3" />
            <z-avatar zSrc="https://github.com/srizzon.png" zAlt="User 2" />
            <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="User 1" />
          </z-avatar-group>
        </ng-template>

        <button z-button zSize="sm" class="mt-4">
          <z-icon zType="plus" />
          Invite Members
        </button>
      </z-empty>

      <div class="flex items-center gap-2">
        <z-badge zType="default" class="rounded-full">
          <z-icon zType="loader-circle" class="size-3 animate-spin" />
          Syncing
        </z-badge>
        <z-badge zType="secondary" class="rounded-full">
          <z-icon zType="loader-circle" class="size-3 animate-spin" />
          Updating
        </z-badge>
        <z-badge zType="outline" class="rounded-full">
          <z-icon zType="loader-circle" class="size-3 animate-spin" />
          Loading
        </z-badge>
      </div>

      <div class="flex gap-2">
        <z-button-group>
          <button z-button zType="outline" class="rounded-full">
            <z-icon zType="plus" />
          </button>
        </z-button-group>
        <z-input-group [zAddonAfter]="addonAfterTpl" class="dark:bg-input/30 rounded-full dark:*:bg-transparent!">
          <input z-input placeholder="Send a message..." />
        </z-input-group>
        <ng-template #addonAfterTpl>
          <button z-button zTooltip="Voice Mode" zType="ghost" zSize="sm" class="rounded-full p-1!">
            <z-icon zType="activity" />
          </button>
        </ng-template>
      </div>

      <div class="w-full max-w-md">
        <z-form-field>
          <label z-form-label>Price Range</label>
          <p class="text-muted-foreground text-sm leading-normal font-normal">
            Set your budget range (\${{ sliderValue }} - $800).
          </p>
          <z-form-control>
            <z-slider [zMin]="0" [zMax]="800" [(ngModel)]="sliderValue" class="flex-1" />
          </z-form-control>
        </z-form-field>
      </div>

      <div class="flex flex-col space-y-4">
        <z-input-group
          [zAddonBefore]="search"
          zAddonAfter="12 results"
          class="dark:bg-input/30 mb-4 dark:*:bg-transparent!"
        >
          <input z-input placeholder="Search..." />
        </z-input-group>

        <z-input-group
          zAddonBefore="https://"
          [zAddonAfter]="info"
          class="dark:bg-input/30 mb-4 dark:*:bg-transparent!"
        >
          <input z-input placeholder="example.com" />
        </z-input-group>

        <z-input-group class="mb-4" [zAddonAfter]="areaAfter" class="dark:bg-input/30 dark:*:bg-transparent!">
          <textarea class="h-30 resize-none" z-input placeholder="Ask, Search or Chat..."></textarea>
        </z-input-group>

        <z-input-group [zAddonAfter]="check" class="dark:bg-input/30 dark:*:bg-transparent!">
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
    </div>
  `,
})
export class HeroColumn2Component {
  sliderValue = 50;
}
