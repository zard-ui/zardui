import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlertTriangle,
  lucideArrowLeft,
  lucideArrowRight,
  lucideAudioLines,
  lucideCheck,
  lucideChevronDown,
  lucideCopy,
  lucideFlipHorizontal,
  lucideFlipVertical,
  lucideHeart,
  lucideMinus,
  lucidePlus,
  lucideRotateCw,
  lucideSearch,
  lucideShare,
  lucideTrash,
  lucideUserRoundX,
  lucideVolumeOff,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupImports } from '@zard/components/button-group/button-group.imports';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardTooltipDirective } from '@zard/components/tooltip/tooltip';

import { ExampleImports } from './example.component';

/** shadcn/ui's `button-group-example`, in zard. zard has no Label, so shadcn's `<Label>` is a field label here. */
@Component({
  selector: 'z-button-group-example',
  imports: [
    ExampleImports,
    ZardButtonComponent,
    ZardButtonGroupImports,
    ZardDropdownImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardSelectImports,
    ZardTooltipDirective,
    NgIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideAlertTriangle,
      lucideArrowLeft,
      lucideArrowRight,
      lucideAudioLines,
      lucideCheck,
      lucideChevronDown,
      lucideCopy,
      lucideFlipHorizontal,
      lucideFlipVertical,
      lucideHeart,
      lucideMinus,
      lucidePlus,
      lucideRotateCw,
      lucideSearch,
      lucideShare,
      lucideTrash,
      lucideUserRoundX,
      lucideVolumeOff,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div class="flex flex-col gap-4">
          <z-button-group>
            <button z-button zType="outline">Button</button>
            <button z-button zType="outline">Another Button</button>
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="With Input">
        <div class="flex flex-col gap-4">
          <z-button-group>
            <button z-button zType="outline">Button</button>
            <input z-input placeholder="Type something here..." />
          </z-button-group>
          <z-button-group>
            <input z-input placeholder="Type something here..." />
            <button z-button zType="outline">Button</button>
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="With Text">
        <div class="flex flex-col gap-4">
          <z-button-group>
            <div z-button-group-text>Text</div>
            <button z-button zType="outline">Another Button</button>
          </z-button-group>
          <z-button-group>
            <label z-button-group-text for="input-text">GPU Size</label>
            <input z-input id="input-text" placeholder="Type something here..." class="style-luma:border-border" />
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="With Dropdown">
        <div class="flex flex-col gap-4">
          <z-button-group>
            <button z-button zType="outline">Update</button>
            <button z-button zType="outline" zSize="icon" z-dropdown [zDropdownMenu]="updateMenu">
              <ng-icon name="lucideChevronDown" />
            </button>
            <z-dropdown-menu-content #updateMenu="zDropdownMenuContent" zAlign="end">
              <z-dropdown-menu-item>Disable</z-dropdown-menu-item>
              <z-dropdown-menu-item variant="destructive">Uninstall</z-dropdown-menu-item>
            </z-dropdown-menu-content>
          </z-button-group>
          <z-button-group>
            <button z-button zType="outline">Follow</button>
            <button z-button zType="outline" zSize="icon" z-dropdown [zDropdownMenu]="followMenu">
              <ng-icon name="lucideChevronDown" />
            </button>
            <z-dropdown-menu-content #followMenu="zDropdownMenuContent" zAlign="end" class="w-50">
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideVolumeOff" />
                  Mute Conversation
                </z-dropdown-menu-item>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideCheck" />
                  Mark as Read
                </z-dropdown-menu-item>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideAlertTriangle" />
                  Report Conversation
                </z-dropdown-menu-item>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideUserRoundX" />
                  Block User
                </z-dropdown-menu-item>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideShare" />
                  Share Conversation
                </z-dropdown-menu-item>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideCopy" />
                  Copy Conversation
                </z-dropdown-menu-item>
              </z-dropdown-menu-group>
              <z-dropdown-menu-separator />
              <z-dropdown-menu-group>
                <z-dropdown-menu-item variant="destructive">
                  <ng-icon name="lucideTrash" />
                  Delete Conversation
                </z-dropdown-menu-item>
              </z-dropdown-menu-group>
            </z-dropdown-menu-content>
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="With Select">
        <div z-field>
          <label z-field-label for="amount">Amount</label>
          <z-button-group>
            <z-select [(zValue)]="currency">
              <z-select-group>
                <z-select-item zValue="$">$</z-select-item>
                <z-select-item zValue="€">€</z-select-item>
                <z-select-item zValue="£">£</z-select-item>
              </z-select-group>
            </z-select>
            <input z-input placeholder="Enter amount to send" />
            <button z-button zType="outline">
              <ng-icon name="lucideArrowRight" />
            </button>
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="With Icons">
        <div class="flex flex-col gap-4">
          <z-button-group>
            <button z-button zType="outline">
              <ng-icon name="lucideFlipHorizontal" />
            </button>
            <button z-button zType="outline">
              <ng-icon name="lucideFlipVertical" />
            </button>
            <button z-button zType="outline">
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="With Input Group">
        <div class="flex flex-col gap-4">
          <z-input-group>
            <input z-input placeholder="Type to search..." />
            <z-input-group-addon zAlign="inline-start" class="text-muted-foreground">
              <ng-icon name="lucideSearch" />
            </z-input-group-addon>
          </z-input-group>
        </div>
      </z-example>

      <z-example zTitle="With Fields">
        <div z-field-group class="grid grid-cols-3 gap-4">
          <div z-field class="col-span-2">
            <label z-field-label for="width">Width</label>
            <z-button-group>
              <z-input-group>
                <input z-input id="width" />
                <z-input-group-addon class="text-muted-foreground">W</z-input-group-addon>
                <z-input-group-addon zAlign="inline-end" class="text-muted-foreground">px</z-input-group-addon>
              </z-input-group>
              <button z-button zType="outline" zSize="icon">
                <ng-icon name="lucideMinus" />
              </button>
              <button z-button zType="outline" zSize="icon">
                <ng-icon name="lucidePlus" />
              </button>
            </z-button-group>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Like">
        <z-button-group>
          <button z-button zType="outline">
            <ng-icon name="lucideHeart" data-icon="inline-start" />
            Like
          </button>
          <z-button zType="outline" zSize="icon" class="w-12">1.2K</z-button>
        </z-button-group>
      </z-example>

      <z-example zTitle="With Select and Input">
        <z-button-group>
          <z-select zValue="hours" zPlaceholder="Select duration">
            <z-select-group>
              <z-select-item zValue="hours">Hours</z-select-item>
              <z-select-item zValue="days">Days</z-select-item>
              <z-select-item zValue="weeks">Weeks</z-select-item>
            </z-select-group>
          </z-select>
          <input z-input />
        </z-button-group>
      </z-example>

      <z-example zTitle="Nested">
        <z-button-group>
          <z-button-group>
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucidePlus" />
            </button>
          </z-button-group>
          <z-button-group>
            <z-input-group>
              <input z-input placeholder="Send a message..." />
              <z-input-group-addon zAlign="inline-end" zTooltip="Voice Mode">
                <ng-icon name="lucideAudioLines" />
              </z-input-group-addon>
            </z-input-group>
          </z-button-group>
        </z-button-group>
      </z-example>

      <z-example zTitle="Pagination">
        <z-button-group>
          <button z-button zType="outline" zSize="sm">
            <ng-icon name="lucideArrowLeft" data-icon="inline-start" />
            Previous
          </button>
          @for (page of pages; track page) {
            <button z-button zType="outline" zSize="sm">{{ page }}</button>
          }
          <button z-button zType="outline" zSize="sm">
            Next
            <ng-icon name="lucideArrowRight" data-icon="inline-end" />
          </button>
        </z-button-group>
      </z-example>

      <z-example zTitle="Pagination Split">
        <z-button-group>
          <z-button-group>
            @for (page of pages; track page) {
              <button z-button zType="outline" zSize="sm">{{ page }}</button>
            }
          </z-button-group>
          <z-button-group>
            <button z-button zType="outline" zSize="icon-xs">
              <ng-icon name="lucideArrowLeft" />
            </button>
            <button z-button zType="outline" zSize="icon-xs">
              <ng-icon name="lucideArrowRight" />
            </button>
          </z-button-group>
        </z-button-group>
      </z-example>

      <z-example zTitle="Navigation">
        <z-button-group>
          <z-button-group>
            <button z-button zType="outline">
              <ng-icon name="lucideArrowLeft" />
            </button>
            <button z-button zType="outline">
              <ng-icon name="lucideArrowRight" />
            </button>
          </z-button-group>
          <z-button-group aria-label="Single navigation button">
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideArrowLeft" />
            </button>
          </z-button-group>
        </z-button-group>
      </z-example>

      <z-example zTitle="Text Alignment">
        <div z-field>
          <label z-field-label id="alignment-label">Text Alignment</label>
          <z-button-group aria-labelledby="alignment-label">
            <button z-button zType="outline" zSize="sm">Left</button>
            <button z-button zType="outline" zSize="sm">Center</button>
            <button z-button zType="outline" zSize="sm">Right</button>
            <button z-button zType="outline" zSize="sm">Justify</button>
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="Vertical">
        <div class="flex gap-6">
          <z-button-group zOrientation="vertical" aria-label="Media controls" class="h-fit">
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucidePlus" />
            </button>
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideMinus" />
            </button>
          </z-button-group>
        </div>
      </z-example>

      <z-example zTitle="Vertical Nested">
        <z-button-group zOrientation="vertical" aria-label="Design tools palette">
          <z-button-group zOrientation="vertical">
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideSearch" />
            </button>
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideCopy" />
            </button>
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideShare" />
            </button>
          </z-button-group>
          <z-button-group zOrientation="vertical">
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideFlipHorizontal" />
            </button>
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideFlipVertical" />
            </button>
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-button-group>
          <z-button-group>
            <button z-button zType="outline" zSize="icon">
              <ng-icon name="lucideTrash" />
            </button>
          </z-button-group>
        </z-button-group>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ButtonGroupExampleComponent {
  protected readonly pages = [1, 2, 3, 4, 5] as const;
  protected readonly currency = signal('$');
}
