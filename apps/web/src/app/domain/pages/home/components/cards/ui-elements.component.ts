import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideChevronUp, lucideSearch } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

/**
 * O card de abertura da parede: um punhado de componentes lado a lado.
 *
 * É o único que não finge ser um pedaço de produto. Ele existe para dizer, antes
 * de qualquer contexto, o que a biblioteca entrega — botão, campo, badge, rádio,
 * checkbox, switch, grupo de botões — e por isso abre a primeira coluna, onde a
 * leitura começa.
 */
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
          <button type="button" z-button>
            Button
            <ng-icon name="lucideArrowRight" data-icon="inline-end" />
          </button>
          <button type="button" z-button zType="secondary">Secondary</button>
          <button type="button" z-button zType="outline">Outline</button>
        </div>

        <div class="flex flex-col gap-4">
          <z-input-group>
            <input z-input placeholder="Name" aria-label="Name" />
            <z-input-group-addon zAlign="inline-end">
              <ng-icon name="lucideSearch" class="text-muted-foreground size-4" />
            </z-input-group-addon>
          </z-input-group>
          <textarea z-textarea placeholder="Message" aria-label="Message" class="resize-none"></textarea>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex gap-2">
            <z-badge>Badge</z-badge>
            <z-badge zType="secondary">Secondary</z-badge>
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

          <z-checkbox zId="ui-elements-alerts" [ngModel]="true" class="gap-0">
            <span class="sr-only">Enable email alerts</span>
          </z-checkbox>
          <z-switch zId="ui-elements-compact" [zChecked]="true">
            <span class="sr-only">Enable compact notifications</span>
          </z-switch>
        </div>

        <div class="flex items-center gap-4">
          <button type="button" z-button zType="outline">Alert Dialog</button>
          <z-button-group class="ml-auto">
            <button type="button" z-button zType="outline">Button Group</button>
            <button type="button" z-button zType="outline" zSize="icon-sm" aria-label="Open quick actions">
              <ng-icon name="lucideChevronUp" />
            </button>
          </z-button-group>
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class CardUiElementsComponent {}
