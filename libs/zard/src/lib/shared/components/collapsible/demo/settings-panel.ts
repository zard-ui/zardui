import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-collapsible-settings-panel',
  imports: [
    ZardCollapsibleImports,
    ZardButtonComponent,
    ZardFieldImports,
    ZardRadioGroupImports,
    ZardSwitchComponent,
    ZardCheckboxComponent,
    NgIcon,
    FormsModule,
  ],
  template: `
    <div class="w-full max-w-sm">
      <z-collapsible class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h4 class="text-sm font-semibold">Appearance</h4>
            <p class="text-muted-foreground text-sm">Fine-tune how the interface looks.</p>
          </div>

          <button z-button z-collapsible-trigger zType="outline" zSize="sm" class="group">
            Customize
            <ng-icon name="lucideChevronDown" class="transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </div>

        <z-collapsible-content>
          <div z-field-group class="rounded-md border p-4">
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Corner radius</legend>

              <z-radio-group class="gap-2" [(ngModel)]="radius" name="radius">
                <div z-field zOrientation="horizontal">
                  <z-radio zId="radius-none" value="none" />
                  <label z-field-label for="radius-none" class="font-normal">None</label>
                </div>
                <div z-field zOrientation="horizontal">
                  <z-radio zId="radius-md" value="md" />
                  <label z-field-label for="radius-md" class="font-normal">Medium</label>
                </div>
                <div z-field zOrientation="horizontal">
                  <z-radio zId="radius-lg" value="lg" />
                  <label z-field-label for="radius-lg" class="font-normal">Large</label>
                </div>
              </z-radio-group>
            </fieldset>

            <z-field-separator />

            <div z-field zOrientation="horizontal">
              <label z-field-label for="reduce-motion">Reduce motion</label>
              <z-switch zId="reduce-motion" zSize="sm" />
            </div>

            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="show-grid" name="showGrid"></span>
              <label z-field-label for="show-grid" class="font-normal">Show grid lines</label>
            </div>
          </div>
        </z-collapsible-content>
      </z-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoCollapsibleSettingsPanelComponent {
  protected radius = 'md';
}
