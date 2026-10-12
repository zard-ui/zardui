import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideBookmark, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardToggleComponent } from '@zard/components/toggle/toggle.component';

import { ExampleImports } from './example.component';

/** shadcn/ui's `toggle-example`, in zard. */
@Component({
  selector: 'z-toggle-example',
  imports: [ExampleImports, ZardButtonComponent, ZardToggleComponent, NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBold, lucideBookmark, lucideItalic, lucideUnderline })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div class="flex flex-wrap items-center gap-2">
          <z-toggle zAriaLabel="Toggle bold" [zValue]="true">
            <ng-icon name="lucideBold" />
          </z-toggle>
          <z-toggle zAriaLabel="Toggle italic">
            <ng-icon name="lucideItalic" />
          </z-toggle>
          <z-toggle zAriaLabel="Toggle underline">
            <ng-icon name="lucideUnderline" />
          </z-toggle>
        </div>
      </z-example>

      <z-example zTitle="Outline">
        <div class="flex flex-wrap items-center gap-2">
          <z-toggle zType="outline" zAriaLabel="Toggle italic">
            <ng-icon name="lucideItalic" data-icon="inline-start" />
            Italic
          </z-toggle>
          <z-toggle zType="outline" zAriaLabel="Toggle bold">
            <ng-icon name="lucideBold" data-icon="inline-start" />
            Bold
          </z-toggle>
        </div>
      </z-example>

      <z-example zTitle="Sizes">
        <div class="flex flex-wrap items-center gap-2">
          <z-toggle zType="outline" zAriaLabel="Toggle small" zSize="sm">Small</z-toggle>
          <z-toggle zType="outline" zAriaLabel="Toggle default" zSize="default">Default</z-toggle>
          <z-toggle zType="outline" zAriaLabel="Toggle large" zSize="lg">Large</z-toggle>
        </div>
      </z-example>

      <z-example zTitle="With Button Text">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <button z-button zSize="sm" zType="outline">Button</button>
            <z-toggle zType="outline" zAriaLabel="Toggle sm" zSize="sm">Toggle</z-toggle>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zSize="default" zType="outline">Button</button>
            <z-toggle zType="outline" zAriaLabel="Toggle default" zSize="default">Toggle</z-toggle>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zSize="lg" zType="outline">Button</button>
            <z-toggle zType="outline" zAriaLabel="Toggle lg" zSize="lg">Toggle</z-toggle>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Button Icon">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <button z-button zType="outline" zSize="icon-sm">
              <ng-icon name="lucideBold" />
            </button>
            <z-toggle zType="outline" zAriaLabel="Toggle sm icon" zSize="sm">
              <ng-icon name="lucideBold" />
            </z-toggle>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideItalic" />
            </button>
            <z-toggle zType="outline" zAriaLabel="Toggle default icon" zSize="default">
              <ng-icon name="lucideItalic" />
            </z-toggle>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zType="outline" zSize="icon-lg">
              <ng-icon name="lucideUnderline" />
            </button>
            <z-toggle zType="outline" zAriaLabel="Toggle lg icon" zSize="lg">
              <ng-icon name="lucideUnderline" />
            </z-toggle>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Button Icon + Text">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <button z-button zSize="sm" zType="outline">
              <ng-icon name="lucideBold" data-icon="inline-start" />
              Button
            </button>
            <z-toggle zType="outline" zAriaLabel="Toggle sm icon text" zSize="sm">
              <ng-icon name="lucideBold" data-icon="inline-start" />
              Toggle
            </z-toggle>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zSize="default" zType="outline">
              <ng-icon name="lucideItalic" data-icon="inline-start" />
              Button
            </button>
            <z-toggle zType="outline" zAriaLabel="Toggle default icon text" zSize="default">
              <ng-icon name="lucideItalic" data-icon="inline-start" />
              Toggle
            </z-toggle>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zSize="lg" zType="outline">
              <ng-icon name="lucideUnderline" data-icon="inline-start" />
              Button
            </button>
            <z-toggle zType="outline" zAriaLabel="Toggle lg icon text" zSize="lg">
              <ng-icon name="lucideUnderline" data-icon="inline-start" />
              Toggle
            </z-toggle>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <div class="flex flex-wrap items-center gap-2">
          <z-toggle zAriaLabel="Toggle disabled" zDisabled>Disabled</z-toggle>
          <z-toggle zType="outline" zAriaLabel="Toggle disabled outline" zDisabled>Disabled</z-toggle>
        </div>
      </z-example>

      <z-example zTitle="With Icon">
        <div class="flex flex-wrap items-center gap-2">
          <z-toggle zAriaLabel="Toggle bookmark" [zValue]="true">
            <ng-icon name="lucideBookmark" class="group-data-[state=on]/toggle:[&_path]:fill-accent-foreground" />
          </z-toggle>
          <z-toggle zType="outline" zAriaLabel="Toggle bookmark outline">
            <ng-icon
              name="lucideBookmark"
              class="group-data-[state=on]/toggle:[&_path]:fill-accent-foreground"
              data-icon="inline-start"
            />
            Bookmark
          </z-toggle>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ToggleExampleComponent {}
