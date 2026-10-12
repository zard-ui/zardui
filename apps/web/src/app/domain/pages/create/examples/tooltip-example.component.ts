import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideSave } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardKbdComponent } from '@zard/components/kbd';
import { ZardTooltipImports } from '@zard/components/tooltip';

import { ExampleImports } from './example.component';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

/** shadcn/ui's `tooltip-example`, in zard. */
@Component({
  selector: 'z-tooltip-example',
  imports: [ExampleImports, NgIcon, ZardButtonComponent, ZardKbdComponent, ZardTooltipImports],
  viewProviders: [provideIcons({ lucideInfo, lucideSave })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <button type="button" z-button zType="outline" class="w-fit" [zTooltip]="addToLibrary">Show Tooltip</button>
      </z-example>

      <z-example zTitle="Sides">
        <div class="flex flex-wrap gap-2">
          @for (side of sides; track side) {
            <button
              type="button"
              z-button
              zType="outline"
              class="style-sera:uppercase w-fit capitalize"
              [zTooltip]="addToLibrary"
              [zPosition]="side"
            >
              {{ side }}
            </button>
          }
        </div>
      </z-example>

      <z-example zTitle="With Icon">
        <button type="button" z-button zType="ghost" zSize="icon" [zTooltip]="additionalInfo">
          <ng-icon name="lucideInfo" />
          <span class="sr-only">Info</span>
        </button>
      </z-example>

      <z-example zTitle="Long Content">
        <button
          type="button"
          z-button
          zType="outline"
          class="w-fit"
          zTooltip="To learn more about how this works, check out the docs. If you have any questions, please reach out to us."
        >
          Show Tooltip
        </button>
      </z-example>

      <z-example zTitle="Disabled">
        <span class="inline-block w-fit" tabindex="0" [zTooltip]="unavailable">
          <button type="button" z-button zType="outline" zDisabled>Disabled</button>
        </span>
      </z-example>

      <z-example zTitle="With Keyboard Shortcut">
        <button type="button" z-button zType="outline" zSize="icon-sm" [zTooltip]="saveChanges">
          <ng-icon name="lucideSave" />
        </button>
      </z-example>

      <z-example zTitle="On Link">
        <a
          href="#"
          class="text-primary w-fit text-sm underline-offset-4 hover:underline"
          [zTooltip]="readDocs"
          (click)="$event.preventDefault()"
        >
          Learn more
        </a>
      </z-example>

      <z-example zTitle="Formatted Content">
        <button type="button" z-button zType="outline" class="w-fit" [zTooltip]="status">Status</button>
      </z-example>
    </z-example-wrapper>

    <ng-template #addToLibrary><p>Add to library</p></ng-template>
    <ng-template #additionalInfo><p>Additional information</p></ng-template>
    <ng-template #unavailable><p>This feature is currently unavailable</p></ng-template>
    <ng-template #saveChanges>
      Save Changes
      <z-kbd>S</z-kbd>
    </ng-template>
    <ng-template #readDocs><p>Click to read the documentation</p></ng-template>
    <ng-template #status>
      <div class="flex flex-col gap-1">
        <p class="font-semibold">Active</p>
        <p class="text-xs opacity-80">Last updated 2 hours ago</p>
      </div>
    </ng-template>
  `,
})
export class TooltipExampleComponent {
  protected readonly sides = SIDES;
}
