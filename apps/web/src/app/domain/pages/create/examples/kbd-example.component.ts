import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight, lucideCircleDashed, lucideSave } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardKbdImports } from '@zard/components/kbd/kbd.imports';
import { ZardTooltipDirective } from '@zard/components/tooltip/tooltip';

import { ExampleImports } from './example.component';

/** shadcn/ui's `kbd-example`, in zard. */
@Component({
  selector: 'z-kbd-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardButtonComponent,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardKbdImports,
    ZardTooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowLeft, lucideArrowRight, lucideCircleDashed, lucideSave })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div class="flex items-center gap-2">
          <z-kbd>Ctrl</z-kbd>
          <z-kbd>⌘K</z-kbd>
          <z-kbd>Ctrl + B</z-kbd>
        </div>
      </z-example>

      <z-example zTitle="Modifier Keys">
        <div class="flex items-center gap-2">
          <z-kbd>⌘</z-kbd>
          <z-kbd>C</z-kbd>
        </div>
      </z-example>

      <z-example zTitle="KbdGroup">
        <z-kbd-group>
          <z-kbd>Ctrl</z-kbd>
          <z-kbd>Shift</z-kbd>
          <z-kbd>P</z-kbd>
        </z-kbd-group>
      </z-example>

      <z-example zTitle="Arrow Keys">
        <div class="flex items-center gap-2">
          <z-kbd>↑</z-kbd>
          <z-kbd>↓</z-kbd>
          <z-kbd>←</z-kbd>
          <z-kbd>→</z-kbd>
        </div>
      </z-example>

      <z-example zTitle="With Icons">
        <z-kbd-group>
          <z-kbd><ng-icon name="lucideCircleDashed" /></z-kbd>
          <z-kbd><ng-icon name="lucideArrowLeft" /></z-kbd>
          <z-kbd><ng-icon name="lucideArrowRight" /></z-kbd>
        </z-kbd-group>
      </z-example>

      <z-example zTitle="With Icons and Text">
        <z-kbd-group>
          <z-kbd>
            <ng-icon name="lucideArrowLeft" />
            Left
          </z-kbd>
          <z-kbd>
            <ng-icon name="lucideCircleDashed" />
            Voice Enabled
          </z-kbd>
        </z-kbd-group>
      </z-example>

      <z-example zTitle="InputGroup">
        <z-input-group>
          <input z-input />
          <z-input-group-addon>
            <z-kbd>Space</z-kbd>
          </z-input-group-addon>
        </z-input-group>
      </z-example>

      <z-example zTitle="Tooltip">
        <button type="button" z-button zSize="icon-sm" zType="outline" [zTooltip]="saveTip">
          <ng-icon name="lucideSave" />
        </button>
        <ng-template #saveTip>
          <div class="flex items-center gap-2">
            Save Changes
            <z-kbd>S</z-kbd>
          </div>
        </ng-template>
      </z-example>

      <z-example zTitle="With samp">
        <z-kbd>
          <samp>File</samp>
        </z-kbd>
      </z-example>
    </z-example-wrapper>
  `,
})
export class KbdExampleComponent {}
