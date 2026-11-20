import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@zard/components/field';
import { ZardSwitchComponent } from '@zard/components/switch';

import { ExampleImports } from './example.component';

/** shadcn/ui's `switch-example`, in zard. A `<Label>` beside a switch is the switch's own projected label. */
@Component({
  selector: 'z-switch-example',
  imports: [ExampleImports, ZardFieldImports, ZardSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div z-field zOrientation="horizontal">
          <z-switch zId="switch-basic" />
          <label z-field-label for="switch-basic">Airplane Mode</label>
        </div>
      </z-example>

      <z-example zTitle="With Description">
        <label z-field-label for="switch-focus-mode">
          <div z-field zOrientation="horizontal">
            <div z-field-content>
              <div z-field-title>Share across devices</div>
              <p z-field-description>Focus is shared across devices, and turns off when you leave the app.</p>
            </div>
            <z-switch zId="switch-focus-mode"><span class="sr-only">Share across devices</span></z-switch>
          </div>
        </label>
      </z-example>

      <z-example zTitle="With Label">
        <div class="flex items-center gap-2">
          <z-switch zId="switch-bluetooth" [zChecked]="true">Bluetooth</z-switch>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <div class="flex flex-col gap-12">
          <div class="flex items-center gap-2">
            <z-switch zId="switch-disabled-unchecked" zDisabled>Disabled (Unchecked)</z-switch>
          </div>
          <div class="flex items-center gap-2">
            <z-switch zId="switch-disabled-checked" [zChecked]="true" zDisabled>Disabled (Checked)</z-switch>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Sizes">
        <div class="flex flex-col gap-12">
          <div class="flex items-center gap-2">
            <z-switch zId="switch-size-sm" zSize="sm">Small</z-switch>
          </div>
          <div class="flex items-center gap-2">
            <z-switch zId="switch-size-default" zSize="default">Default</z-switch>
          </div>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class SwitchExampleComponent {}
