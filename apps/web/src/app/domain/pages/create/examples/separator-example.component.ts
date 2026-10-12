import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '@zard/components/separator';

import { ExampleImports } from './example.component';

/** shadcn/ui's `separator-example`, in zard. */
@Component({
  selector: 'z-separator-example',
  imports: [ExampleImports, ZardSeparatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Horizontal">
        <div class="style-lyra:text-xs/relaxed flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-1">
            <div class="leading-none font-medium">shadcn/ui</div>
            <div class="text-muted-foreground">The Foundation for your Design System</div>
          </div>
          <z-separator />
          <div>A set of beautifully designed components that you can customize, extend, and build on.</div>
        </div>
      </z-example>

      <z-example zTitle="Vertical">
        <div class="style-lyra:text-xs/relaxed flex h-5 items-center gap-4 text-sm">
          <div>Blog</div>
          <z-separator zOrientation="vertical" />
          <div>Docs</div>
          <z-separator zOrientation="vertical" />
          <div>Source</div>
        </div>
      </z-example>

      <z-example zTitle="Vertical Menu">
        <div class="style-lyra:text-xs/relaxed flex items-center gap-2 text-sm md:gap-4">
          <div class="flex flex-col gap-1">
            <span class="font-medium">Settings</span>
            <span class="text-muted-foreground text-xs">Manage preferences</span>
          </div>
          <z-separator zOrientation="vertical" />
          <div class="flex flex-col gap-1">
            <span class="font-medium">Account</span>
            <span class="text-muted-foreground text-xs">Profile &amp; security</span>
          </div>
          <z-separator zOrientation="vertical" />
          <div class="flex flex-col gap-1">
            <span class="font-medium">Help</span>
            <span class="text-muted-foreground text-xs">Support &amp; docs</span>
          </div>
        </div>
      </z-example>

      <z-example zTitle="In List">
        <div class="style-lyra:text-xs/relaxed flex flex-col gap-2 text-sm">
          @for (item of items; track item; let last = $last) {
            <dl class="flex items-center justify-between">
              <dt>Item {{ item }}</dt>
              <dd class="text-muted-foreground">Value {{ item }}</dd>
            </dl>
            @if (!last) {
              <z-separator />
            }
          }
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class SeparatorExampleComponent {
  protected readonly items = [1, 2, 3] as const;
}
