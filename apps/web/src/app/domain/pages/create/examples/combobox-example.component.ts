import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideGlobe } from '@ng-icons/lucide';
import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardComboboxImports } from '@zard/components/combobox';
import { ZardDialogImports } from '@zard/components/dialog';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardItemImports } from '@zard/components/item';
import { ZardSelectImports } from '@zard/components/select';

import { COMBOBOX_COUNTRIES } from './combobox-example.data';
import { ExampleImports } from './example.component';

const FRAMEWORKS = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'] as const;

const DISABLED_FRAMEWORKS: readonly string[] = ['Nuxt.js', 'Remix'];

const TIMEZONES = [
  {
    value: 'Americas',
    items: [
      '(GMT-5) New York',
      '(GMT-8) Los Angeles',
      '(GMT-6) Chicago',
      '(GMT-5) Toronto',
      '(GMT-8) Vancouver',
      '(GMT-3) São Paulo',
    ],
  },
  {
    value: 'Europe',
    items: ['(GMT+0) London', '(GMT+1) Paris', '(GMT+1) Berlin', '(GMT+1) Rome', '(GMT+1) Madrid', '(GMT+1) Amsterdam'],
  },
  {
    value: 'Asia/Pacific',
    items: [
      '(GMT+9) Tokyo',
      '(GMT+8) Shanghai',
      '(GMT+8) Singapore',
      '(GMT+4) Dubai',
      '(GMT+11) Sydney',
      '(GMT+9) Seoul',
    ],
  },
] as const;

const LARGE_LIST_ITEMS = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

type ComboboxValue = string | string[] | null;

/** shadcn/ui's `combobox-example`, in zard. */
@Component({
  selector: 'z-combobox-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardButtonComponent,
    ZardCardImports,
    ZardComboboxImports,
    ZardDialogImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardItemImports,
    ZardSelectImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown, lucideGlobe })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-combobox>
          <z-combobox-input placeholder="Select a framework" />
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Disabled">
        <z-combobox>
          <z-combobox-input placeholder="Select a framework" zDisabled />
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Invalid">
        <div class="flex flex-col gap-4">
          <z-combobox zInvalid>
            <z-combobox-input placeholder="Select a framework" />
            <z-combobox-content>
              <z-combobox-empty>No items found.</z-combobox-empty>
              <z-combobox-list>
                @for (item of frameworks; track item) {
                  <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                }
              </z-combobox-list>
            </z-combobox-content>
          </z-combobox>
          <div z-field data-invalid="true">
            <label z-field-label [for]="invalidCombobox.inputId">Framework</label>
            <z-combobox #invalidCombobox="zCombobox" zInvalid>
              <z-combobox-input placeholder="Select a framework" />
              <z-combobox-content>
                <z-combobox-empty>No items found.</z-combobox-empty>
                <z-combobox-list>
                  @for (item of frameworks; track item) {
                    <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                  }
                </z-combobox-list>
              </z-combobox-content>
            </z-combobox>
            <p z-field-description>Please select a valid framework.</p>
            <z-field-error>This field is required.</z-field-error>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Clear Button">
        <z-combobox [(zValue)]="clearValue">
          <z-combobox-input placeholder="Select a framework" zShowClear />
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="With Auto Highlight">
        <z-combobox zAutoHighlight>
          <z-combobox-input placeholder="Select a framework" />
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="With Groups">
        <z-combobox>
          <z-combobox-input placeholder="Select a timezone" />
          <z-combobox-content>
            <z-combobox-empty>No timezones found.</z-combobox-empty>
            <z-combobox-list>
              @for (group of timezones; track group.value) {
                <z-combobox-group>
                  <z-combobox-label>{{ group.value }}</z-combobox-label>
                  @for (item of group.items; track item) {
                    <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                  }
                </z-combobox-group>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="With Groups and Separator">
        <z-combobox>
          <z-combobox-input placeholder="Select a timezone" />
          <z-combobox-content>
            <z-combobox-empty>No timezones found.</z-combobox-empty>
            <z-combobox-list>
              @for (group of timezones; track group.value) {
                <z-combobox-group>
                  <z-combobox-label>{{ group.value }}</z-combobox-label>
                  @for (item of group.items; track item) {
                    <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                  }
                  <z-combobox-separator />
                </z-combobox-group>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Large List (100 items)">
        <z-combobox>
          <z-combobox-input placeholder="Search from 100 items" />
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of largeListItems; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="With Icon Addon">
        <z-combobox>
          <z-combobox-input placeholder="Select a timezone">
            <z-input-group-addon>
              <ng-icon name="lucideGlobe" />
            </z-input-group-addon>
          </z-combobox-input>
          <z-combobox-content [zAlignOffset]="-28" class="w-60">
            <z-combobox-empty>No timezones found.</z-combobox-empty>
            <z-combobox-list>
              @for (group of timezones; track group.value) {
                <z-combobox-group>
                  <z-combobox-label>{{ group.value }}</z-combobox-label>
                  @for (item of group.items; track item) {
                    <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                  }
                </z-combobox-group>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Combobox in Popup">
        <z-combobox zWidth="full" class="w-fit" [(zValue)]="popupValue">
          <button type="button" z-button z-combobox-trigger zType="outline" class="w-64 justify-between font-normal">
            <z-combobox-value placeholder="Select country" />
          </button>
          <z-combobox-content>
            <z-combobox-input [zShowTrigger]="false" placeholder="Search" />
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of countries; track item.code) {
                <z-combobox-item [zValue]="item.value" [zLabel]="item.label">{{ item.label }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Form with Combobox">
        <z-card zSize="sm" class="w-full max-w-sm">
          <z-card-content>
            <form id="form-with-combobox" class="w-full" (submit)="submitForm($event)">
              <div z-field-group>
                <div z-field>
                  <label z-field-label [for]="formCombobox.inputId">Framework</label>
                  <z-combobox #formCombobox="zCombobox" [(zValue)]="formValue">
                    <z-combobox-input placeholder="Select a framework" />
                    <z-combobox-content>
                      <z-combobox-empty>No items found.</z-combobox-empty>
                      <z-combobox-list>
                        @for (item of frameworks; track item) {
                          <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                        }
                      </z-combobox-list>
                    </z-combobox-content>
                  </z-combobox>
                </div>
              </div>
            </form>
          </z-card-content>
          <z-card-footer>
            <button type="submit" z-button form="form-with-combobox">Submit</button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Combobox Multiple">
        <z-combobox zMultiple zAutoHighlight zWidth="full" [(zValue)]="multipleValue">
          <z-combobox-chips>
            @for (value of asList(multipleValue()); track value) {
              <z-combobox-chip [zValue]="value">{{ value }}</z-combobox-chip>
            }
            <input z-combobox-chips-input />
          </z-combobox-chips>
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Combobox Multiple Disabled">
        <z-combobox zMultiple zAutoHighlight zDisabled zWidth="full" [(zValue)]="multipleDisabledValue">
          <z-combobox-chips>
            @for (value of asList(multipleDisabledValue()); track value) {
              <z-combobox-chip [zValue]="value">{{ value }}</z-combobox-chip>
            }
            <input z-combobox-chips-input />
          </z-combobox-chips>
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Combobox Multiple Invalid">
        <div class="flex flex-col gap-4">
          <z-combobox zMultiple zAutoHighlight zInvalid zWidth="full" [(zValue)]="multipleInvalidValue">
            <z-combobox-chips>
              @for (value of asList(multipleInvalidValue()); track value) {
                <z-combobox-chip [zValue]="value">{{ value }}</z-combobox-chip>
              }
              <input z-combobox-chips-input />
            </z-combobox-chips>
            <z-combobox-content>
              <z-combobox-empty>No items found.</z-combobox-empty>
              <z-combobox-list>
                @for (item of frameworks; track item) {
                  <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                }
              </z-combobox-list>
            </z-combobox-content>
          </z-combobox>
          <div z-field data-invalid="true">
            <label z-field-label for="combobox-multiple-invalid">Frameworks</label>
            <z-combobox zMultiple zAutoHighlight zInvalid zWidth="full" [(zValue)]="multipleInvalidFieldValue">
              <z-combobox-chips>
                @for (value of asList(multipleInvalidFieldValue()); track value) {
                  <z-combobox-chip [zValue]="value">{{ value }}</z-combobox-chip>
                }
                <input z-combobox-chips-input id="combobox-multiple-invalid" />
              </z-combobox-chips>
              <z-combobox-content>
                <z-combobox-empty>No items found.</z-combobox-empty>
                <z-combobox-list>
                  @for (item of frameworks; track item) {
                    <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                  }
                </z-combobox-list>
              </z-combobox-content>
            </z-combobox>
            <p z-field-description>Please select at least one framework.</p>
            <z-field-error>This field is required.</z-field-error>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Combobox Multiple (No Remove)">
        <z-combobox zMultiple zAutoHighlight zWidth="full" [(zValue)]="multipleNoRemoveValue">
          <z-combobox-chips>
            @for (value of asList(multipleNoRemoveValue()); track value) {
              <z-combobox-chip [zValue]="value" [zShowRemove]="false">{{ value }}</z-combobox-chip>
            }
            <input z-combobox-chips-input />
          </z-combobox-chips>
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="With Custom Item Rendering">
        <z-combobox>
          <z-combobox-input placeholder="Search countries..." />
          <z-combobox-content>
            <z-combobox-empty>No countries found.</z-combobox-empty>
            <z-combobox-list>
              @for (country of customCountries; track country.code) {
                <z-combobox-item [zValue]="country.value" [zLabel]="country.label">
                  <div z-item zSize="xs" class="p-0">
                    <div z-item-content>
                      <div z-item-title class="whitespace-nowrap">{{ country.label }}</div>
                      <p z-item-description>{{ country.continent }} ({{ country.code }})</p>
                    </div>
                  </div>
                </z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>

      <z-example zTitle="Combobox in Dialog">
        <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">Open Dialog</button>
        <z-dialog class="sm:max-w-[425px]" [(zVisible)]="dialogOpen">
          <z-dialog-header>
            <z-dialog-title>Select Framework</z-dialog-title>
            <z-dialog-description>Choose your preferred framework from the list below.</z-dialog-description>
          </z-dialog-header>
          <div z-field>
            <label z-field-label class="sr-only" [for]="dialogCombobox.inputId">Framework</label>
            <z-combobox #dialogCombobox="zCombobox">
              <z-combobox-input placeholder="Select a framework" />
              <z-combobox-content>
                <z-combobox-empty>No items found.</z-combobox-empty>
                <z-combobox-list>
                  @for (item of frameworks; track item) {
                    <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                  }
                </z-combobox-list>
              </z-combobox-content>
            </z-combobox>
          </div>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" (click)="dialogOpen.set(false)">Cancel</button>
            <button type="button" z-button (click)="confirmDialog()">Confirm</button>
          </z-dialog-footer>
        </z-dialog>
      </z-example>

      <z-example zTitle="With Other Inputs">
        <z-combobox class="w-52">
          <z-combobox-input placeholder="Select a framework" />
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
        <z-select class="w-52" zPlaceholder="Select a framework">
          <z-select-group>
            @for (framework of frameworks; track framework) {
              <z-select-item [zValue]="framework">{{ framework }}</z-select-item>
            }
          </z-select-group>
        </z-select>
        <button
          type="button"
          z-button
          zType="outline"
          class="text-muted-foreground style-sera:hidden w-52 justify-between font-normal"
        >
          Select a framework
          <ng-icon name="lucideChevronDown" />
        </button>
        <input z-input placeholder="Select a framework" class="w-52" />
        <z-input-group class="w-52">
          <input z-input placeholder="Select a framework" />
          <z-input-group-addon zAlign="inline-end">
            <ng-icon name="lucideChevronDown" />
          </z-input-group-addon>
        </z-input-group>
      </z-example>

      <z-example zTitle="Disabled Items">
        <z-combobox>
          <z-combobox-input placeholder="Select a framework" />
          <z-combobox-content>
            <z-combobox-empty>No items found.</z-combobox-empty>
            <z-combobox-list>
              @for (item of frameworks; track item) {
                <z-combobox-item [zValue]="item" [zDisabled]="disabledFrameworks.includes(item)">
                  {{ item }}
                </z-combobox-item>
              }
            </z-combobox-list>
          </z-combobox-content>
        </z-combobox>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ComboboxExampleComponent {
  protected readonly frameworks = FRAMEWORKS;
  protected readonly disabledFrameworks = DISABLED_FRAMEWORKS;
  protected readonly timezones = TIMEZONES;
  protected readonly largeListItems = LARGE_LIST_ITEMS;
  protected readonly countries = COMBOBOX_COUNTRIES;
  protected readonly customCountries = COMBOBOX_COUNTRIES.filter(country => country.code !== '');

  protected readonly clearValue = signal<ComboboxValue>(FRAMEWORKS[0]);
  protected readonly popupValue = signal<ComboboxValue>(COMBOBOX_COUNTRIES[0].value);
  protected readonly formValue = signal<ComboboxValue>(null);
  protected readonly multipleValue = signal<ComboboxValue>([FRAMEWORKS[0]]);
  protected readonly multipleDisabledValue = signal<ComboboxValue>([FRAMEWORKS[0], FRAMEWORKS[1]]);
  protected readonly multipleInvalidValue = signal<ComboboxValue>([FRAMEWORKS[0], FRAMEWORKS[1]]);
  protected readonly multipleInvalidFieldValue = signal<ComboboxValue>([FRAMEWORKS[0], FRAMEWORKS[1], FRAMEWORKS[2]]);
  protected readonly multipleNoRemoveValue = signal<ComboboxValue>([FRAMEWORKS[0], FRAMEWORKS[1]]);
  protected readonly dialogOpen = signal(false);

  protected asList(value: ComboboxValue): string[] {
    if (value === null) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }

  protected submitForm(event: Event): void {
    event.preventDefault();
    toast(`You selected ${this.formValue() ?? ''} as your framework.`);
  }

  protected confirmDialog(): void {
    toast('Framework selected.');
    this.dialogOpen.set(false);
  }
}
