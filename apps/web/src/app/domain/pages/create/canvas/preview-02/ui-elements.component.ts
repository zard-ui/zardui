import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp, lucideSearch } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@zard/components/alert-dialog/alert-dialog.imports';
import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSliderImports } from '@zard/components/slider/slider.imports';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-preview-02-ui-elements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NgIcon,
    ZardAlertDialogImports,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardCardImports,
    ZardCheckboxComponent,
    ZardDropdownImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardItemImports,
    ZardRadioGroupImports,
    ZardSliderImports,
    ZardSwitchComponent,
    ZardTextareaComponent,
  ],
  viewProviders: [provideIcons({ lucideChevronUp, lucideSearch })],
  host: { class: 'block w-full' },
  template: `
    <z-card class="w-full">
      <z-card-content class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap gap-2">
            <button type="button" z-button>Button</button>
            <button type="button" z-button zType="secondary">Secondary</button>
            <button type="button" z-button zType="outline">Outline</button>
            <button type="button" z-button zType="ghost">Ghost</button>
          </div>
          <div z-item zVariant="outline">
            <div z-item-content>
              <div z-item-title>Two-factor authentication</div>
              <p z-item-description class="text-pretty xl:hidden 2xl:block">Verify via email or phone number.</p>
            </div>
            <div z-item-actions class="hidden md:flex">
              <button type="button" z-button zSize="sm" zType="secondary">Enable</button>
            </div>
          </div>
        </div>
        <z-slider class="flex-1" [zDefault]="[500]" [zMin]="0" [zMax]="1000" [zStep]="10" aria-label="Slider" />
        <z-field-group>
          <z-field>
            <z-input-group>
              <input z-input placeholder="Name" aria-label="Name" />
              <z-input-group-addon zAlign="inline-end">
                <span z-input-group-text><ng-icon name="lucideSearch" /></span>
              </z-input-group-addon>
            </z-input-group>
          </z-field>
          <z-field class="flex-1">
            <textarea z-textarea placeholder="Message" aria-label="Message" class="resize-none"></textarea>
          </z-field>
        </z-field-group>
        <div class="flex items-center gap-2">
          <div class="flex gap-2">
            <z-badge>Badge</z-badge>
            <z-badge zType="secondary">Secondary</z-badge>
            <z-badge zType="outline">Outline</z-badge>
          </div>
          <z-radio-group
            name="p2-ui-elements-fruit"
            [value]="'apple'"
            aria-label="Fruit"
            class="ml-auto flex w-fit flex-row gap-3"
          >
            <z-radio [value]="'apple'" aria-label="Apple" />
            <z-radio [value]="'banana'" aria-label="Banana" />
          </z-radio-group>
          <div class="flex gap-3">
            <z-checkbox [ngModel]="true" class="gap-0"><span class="sr-only">Checked</span></z-checkbox>
            <z-checkbox class="gap-0"><span class="sr-only">Unchecked</span></z-checkbox>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button type="button" z-button zType="outline" (click)="alertOpen.set(true)">
            <span class="style-sera:md:hidden hidden md:flex">Alert Dialog</span>
            <span class="style-sera:md:flex flex md:hidden">Dialog</span>
          </button>
          <z-alert-dialog [(zVisible)]="alertOpen" zSize="sm">
            <z-alert-dialog-header>
              <z-alert-dialog-title>Allow accessory to connect?</z-alert-dialog-title>
              <z-alert-dialog-description>
                Do you want to allow the USB accessory to connect to this device and your data?
              </z-alert-dialog-description>
            </z-alert-dialog-header>
            <z-alert-dialog-footer>
              <button type="button" z-button zType="outline" z-alert-dialog-close>Don't allow</button>
              <button type="button" z-button (click)="alertOpen.set(false)">Allow</button>
            </z-alert-dialog-footer>
          </z-alert-dialog>
          <z-button-group>
            <button type="button" z-button zType="outline">
              <span class="style-sera:hidden">Button Group</span>
              <span class="style-sera:block hidden">Group</span>
            </button>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Quick actions"
              z-dropdown
              [zDropdownMenu]="menu"
            >
              <ng-icon name="lucideChevronUp" />
            </button>
          </z-button-group>
          <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end" zSide="top" class="w-fit">
            <z-dropdown-menu-group>
              <z-dropdown-menu-label>Quick Actions</z-dropdown-menu-label>
              <z-dropdown-menu-item>Mute Conversation</z-dropdown-menu-item>
              <z-dropdown-menu-item>Mark as Read</z-dropdown-menu-item>
              <z-dropdown-menu-item>Block User</z-dropdown-menu-item>
            </z-dropdown-menu-group>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-group>
              <z-dropdown-menu-label>Conversation</z-dropdown-menu-label>
              <z-dropdown-menu-item>Share Conversation</z-dropdown-menu-item>
              <z-dropdown-menu-item>Copy Conversation</z-dropdown-menu-item>
              <z-dropdown-menu-item>Report Conversation</z-dropdown-menu-item>
            </z-dropdown-menu-group>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-group>
              <z-dropdown-menu-item zVariant="destructive">Delete Conversation</z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-content>
          <z-switch [zChecked]="true" class="ml-auto"><span class="sr-only">Switch</span></z-switch>
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02UiElementsComponent {
  protected readonly alertOpen = signal(false);
}
