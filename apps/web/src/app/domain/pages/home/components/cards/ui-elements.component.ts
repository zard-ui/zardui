import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideChevronUp, lucideSearch } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-card-ui-elements',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardBadgeComponent,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardTextareaComponent,
    ZardCheckboxComponent,
    ZardFieldImports,
    ZardSwitchComponent,
    ZardRadioGroupImports,
    FormsModule,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideArrowRight, lucideChevronUp, lucideSearch })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-content class="flex flex-col gap-6">
        <div class="flex gap-2">
          <button type="button" z-button class="has-data-[icon=inline-end]:pr-2.5!">
            Button
            <ng-icon name="lucideArrowRight" data-icon="inline-end" />
          </button>
          <button type="button" z-button zType="secondary">Secondary</button>
          <button type="button" z-button zType="outline">Outline</button>
        </div>

        <div z-field-group>
          <div z-field>
            <z-input-group>
              <input z-input placeholder="Name" aria-label="Name" />
              <z-input-group-addon zAlign="inline-end">
                <ng-icon name="lucideSearch" class="text-muted-foreground size-4" />
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field class="flex-1">
            <textarea z-textarea placeholder="Message" aria-label="Message" class="resize-none"></textarea>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex gap-2">
            <z-badge>Badge</z-badge>
            <z-badge zType="secondary">Secondary</z-badge>
            <z-badge zType="outline" class="4xl:flex hidden">Outline</z-badge>
          </div>

          <z-radio-group
            name="ui-elements-fruit"
            [value]="'apple'"
            aria-label="Fruit preference"
            class="ml-auto flex w-fit flex-row gap-3"
          >
            <label class="sr-only" for="ui-elements-apple">Apple</label>
            <z-radio zId="ui-elements-apple" [value]="'apple'" />
            <label class="sr-only" for="ui-elements-banana">Banana</label>
            <z-radio zId="ui-elements-banana" [value]="'banana'" />
          </z-radio-group>

          <div class="flex gap-3">
            <z-checkbox zId="ui-elements-alerts" [ngModel]="true" class="gap-0">
              <span class="sr-only">Enable email alerts</span>
            </z-checkbox>
            <z-checkbox zId="ui-elements-push" class="4xl:flex hidden gap-0">
              <span class="sr-only">Enable push alerts</span>
            </z-checkbox>
          </div>
          <z-switch zId="ui-elements-compact" [zChecked]="true" class="4xl:hidden flex">
            <span class="sr-only">Enable compact notifications</span>
          </z-switch>
        </div>

        <div class="flex items-center gap-4">
          <button type="button" z-button zType="outline">Alert Dialog</button>
          <z-button-group
            class="ml-auto [&>*:first-child]:rounded-l-[18px]! [&>*:not(:first-child)]:rounded-l-none! [&>*:not(:last-child)]:rounded-r-none! [&>[data-slot]:last-child:last-child]:rounded-r-[18px]!"
          >
            <button type="button" z-button zType="outline">Button Group</button>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon-sm"
              class="size-8"
              aria-label="Open quick actions"
            >
              <ng-icon name="lucideChevronUp" />
            </button>
          </z-button-group>
          <z-switch zId="ui-elements-advanced" [zChecked]="true" class="4xl:flex hidden">
            <span class="sr-only">Enable advanced setting</span>
          </z-switch>
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class CardUiElementsComponent {}
