import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideCheck,
  lucideChevronDown,
  lucideCode,
  lucideCopy,
  lucideExternalLink,
  lucideEyeOff,
  lucideInfo,
  lucideMail,
  lucideMic,
  lucideRadio,
  lucideRefreshCw,
  lucideSearch,
  lucideSparkles,
  lucideStar,
  lucideTrash,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardKbdGroupComponent } from '@zard/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@zard/components/kbd/kbd.component';
import { ZardPopoverImports } from '@zard/components/popover/popover.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSpinnerComponent } from '@zard/components/spinner/spinner.component';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';
import { ZardTooltipDirective } from '@zard/components/tooltip/tooltip';

import { ExampleImports } from './example.component';

const COUNTRY_CODES = ['+1', '+44', '+46'] as const;

/** shadcn/ui's `input-group-example`, in zard. */
@Component({
  selector: 'z-input-group-example',
  imports: [
    ExampleImports,
    ZardButtonComponent,
    ZardCardImports,
    ZardDropdownImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardKbdComponent,
    ZardKbdGroupComponent,
    ZardPopoverImports,
    ZardSpinnerComponent,
    ZardTextareaComponent,
    ZardTooltipDirective,
    NgIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUp,
      lucideCheck,
      lucideChevronDown,
      lucideCode,
      lucideCopy,
      lucideExternalLink,
      lucideEyeOff,
      lucideInfo,
      lucideMail,
      lucideMic,
      lucideRadio,
      lucideRefreshCw,
      lucideSearch,
      lucideSparkles,
      lucideStar,
      lucideTrash,
    }),
  ],
  template: `
    <z-example-wrapper zClass="min-w-0">
      <z-example zTitle="Basic">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="input-default-01">Default (No Input Group)</label>
            <input z-input placeholder="Placeholder" id="input-default-01" />
          </div>
          <div z-field>
            <label z-field-label for="input-group-02">Input Group</label>
            <z-input-group>
              <input z-input id="input-group-02" placeholder="Placeholder" />
            </z-input-group>
          </div>
          <div z-field data-disabled="true">
            <label z-field-label for="input-disabled-03">Disabled</label>
            <z-input-group>
              <input z-input id="input-disabled-03" placeholder="This field is disabled" disabled />
            </z-input-group>
          </div>
          <div z-field data-invalid="true">
            <label z-field-label for="input-invalid-04">Invalid</label>
            <z-input-group>
              <input z-input id="input-invalid-04" placeholder="This field is invalid" aria-invalid="true" />
            </z-input-group>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Addons">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="input-icon-left-05">Addon (inline-start)</label>
            <z-input-group>
              <input z-input id="input-icon-left-05" />
              <z-input-group-addon>
                <ng-icon name="lucideSearch" class="text-muted-foreground" />
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="input-icon-right-07">Addon (inline-end)</label>
            <z-input-group>
              <input z-input id="input-icon-right-07" />
              <z-input-group-addon zAlign="inline-end">
                <ng-icon name="lucideEyeOff" />
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="input-icon-both-09">Addon (inline-start and inline-end)</label>
            <z-input-group>
              <input z-input id="input-icon-both-09" />
              <z-input-group-addon>
                <ng-icon name="lucideMic" class="text-muted-foreground" />
              </z-input-group-addon>
              <z-input-group-addon zAlign="inline-end">
                <ng-icon name="lucideRadio" class="animate-pulse text-red-500" />
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="input-addon-20">Addon (block-start)</label>
            <z-input-group class="h-auto">
              <input z-input id="input-addon-20" />
              <z-input-group-addon zAlign="block-start">
                <z-input-group-text>First Name</z-input-group-text>
                <ng-icon name="lucideInfo" class="text-muted-foreground ml-auto" />
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="input-addon-21">Addon (block-end)</label>
            <z-input-group class="h-auto">
              <input z-input id="input-addon-21" />
              <z-input-group-addon zAlign="block-end">
                <z-input-group-text>20/240 characters</z-input-group-text>
                <ng-icon name="lucideInfo" class="text-muted-foreground ml-auto" />
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="input-icon-both-10">Multiple Icons</label>
            <z-input-group>
              <input z-input id="input-icon-both-10" />
              <z-input-group-addon zAlign="inline-end">
                <ng-icon name="lucideStar" />
                <button z-input-group-button zSize="icon-xs" (click)="toast('Copied to clipboard')">
                  <ng-icon name="lucideCopy" />
                </button>
              </z-input-group-addon>
              <z-input-group-addon>
                <ng-icon name="lucideRadio" class="animate-pulse text-red-500" />
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="input-description-10">Description</label>
            <z-input-group>
              <input z-input id="input-description-10" />
              <z-input-group-addon zAlign="inline-end">
                <ng-icon name="lucideInfo" />
              </z-input-group-addon>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
          <div z-field>
            <label z-field-label for="input-label-10">Label</label>
            <z-input-group>
              <z-input-group-addon>
                <label z-field-label for="input-label-10">Label</label>
              </z-input-group-addon>
              <input z-input id="input-label-10" />
            </z-input-group>
            <z-input-group>
              <input z-input id="input-optional-12" aria-label="Optional" />
              <z-input-group-addon zAlign="inline-end">
                <z-input-group-text>(optional)</z-input-group-text>
              </z-input-group-addon>
            </z-input-group>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Buttons">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="input-button-13">Button</label>
            <z-input-group>
              <input z-input id="input-button-13" />
              <z-input-group-addon>
                <button z-input-group-button>Default</button>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-button-14" />
              <z-input-group-addon>
                <button z-input-group-button zVariant="outline">Outline</button>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-button-15" />
              <z-input-group-addon>
                <button z-input-group-button zVariant="secondary">Secondary</button>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-button-16" />
              <z-input-group-addon zAlign="inline-end">
                <button z-input-group-button zVariant="secondary">Button</button>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-button-17" />
              <z-input-group-addon zAlign="inline-end">
                <button z-input-group-button zSize="icon-xs">
                  <ng-icon name="lucideCopy" />
                </button>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-button-18" />
              <z-input-group-addon zAlign="inline-end">
                <button z-input-group-button zVariant="secondary" zSize="icon-xs">
                  <ng-icon name="lucideTrash" />
                </button>
              </z-input-group-addon>
            </z-input-group>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Tooltip, Dropdown, Popover">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="input-tooltip-20">Tooltip</label>
            <z-input-group>
              <input z-input id="input-tooltip-20" />
              <z-input-group-addon zAlign="inline-end">
                <button
                  z-input-group-button
                  class="rounded-full"
                  zSize="icon-xs"
                  zTooltip="This is content in a tooltip."
                >
                  <ng-icon name="lucideInfo" />
                </button>
              </z-input-group-addon>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
          <div z-field>
            <label z-field-label for="input-dropdown-21">Dropdown</label>
            <z-input-group>
              <input z-input id="input-dropdown-21" />
              <z-input-group-addon>
                <button
                  z-input-group-button
                  class="text-muted-foreground tabular-nums"
                  z-dropdown
                  [zDropdownMenu]="countryMenu"
                >
                  {{ country() }}
                  <ng-icon name="lucideChevronDown" />
                </button>
                <z-dropdown-menu-content
                  #countryMenu="zDropdownMenuContent"
                  zAlign="start"
                  class="min-w-16"
                  [zSideOffset]="10"
                >
                  @for (code of countryCodes; track code) {
                    <z-dropdown-menu-item (click)="country.set(code)">{{ code }}</z-dropdown-menu-item>
                  }
                </z-dropdown-menu-content>
              </z-input-group-addon>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
          <div z-field>
            <label z-field-label for="input-secure-19">Popover</label>
            <z-input-group>
              <!-- zard's popover and addon both take zAlign, so the popover sits on the button, not the addon. -->
              <z-input-group-addon>
                <button
                  z-input-group-button
                  zVariant="secondary"
                  zSize="icon-xs"
                  zPopover
                  zAlign="start"
                  [zContent]="securePopover"
                >
                  <ng-icon name="lucideInfo" />
                </button>
              </z-input-group-addon>
              <z-input-group-addon class="text-muted-foreground pl-1">https://</z-input-group-addon>
              <input z-input id="input-secure-19" />
              <z-input-group-addon zAlign="inline-end">
                <button z-input-group-button zSize="icon-xs" (click)="toast('Added to favorites')">
                  <ng-icon name="lucideStar" />
                </button>
              </z-input-group-addon>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
            <ng-template #securePopover>
              <z-popover>
                <div z-popover-header>
                  <h4 z-popover-title>Your connection is not secure.</h4>
                  <p z-popover-description>You should not enter any sensitive information on this site.</p>
                </div>
              </z-popover>
            </ng-template>
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Kbd">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="input-kbd-22">Input Group with Kbd</label>
            <z-input-group>
              <input z-input id="input-kbd-22" />
              <z-input-group-addon>
                <z-kbd>⌘K</z-kbd>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-kbd-23" />
              <z-input-group-addon zAlign="inline-end">
                <z-kbd>⌘K</z-kbd>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-search-apps-24" placeholder="Search for Apps..." />
              <z-input-group-addon zAlign="inline-end">Ask AI</z-input-group-addon>
              <z-input-group-addon zAlign="inline-end">
                <z-kbd>Tab</z-kbd>
              </z-input-group-addon>
            </z-input-group>
            <z-input-group>
              <input z-input id="input-search-type-25" placeholder="Type to search..." />
              <z-input-group-addon zAlign="inline-start">
                <ng-icon name="lucideSparkles" />
              </z-input-group-addon>
              <z-input-group-addon zAlign="inline-end">
                <z-kbd-group>
                  <z-kbd>Ctrl</z-kbd>
                  <z-kbd>C</z-kbd>
                </z-kbd-group>
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="input-username-26">Username</label>
            <z-input-group>
              <input z-input id="input-username-26" value="shadcn" />
              <z-input-group-addon zAlign="inline-end">
                <div class="flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800">
                  <ng-icon name="lucideCheck" class="size-3 text-white" />
                </div>
              </z-input-group-addon>
            </z-input-group>
            <p z-field-description class="text-green-700">This username is available.</p>
          </div>
          <z-input-group>
            <input z-input id="input-search-docs-27" placeholder="Search documentation..." />
            <z-input-group-addon>
              <ng-icon name="lucideSearch" />
            </z-input-group-addon>
            <z-input-group-addon zAlign="inline-end">12 results</z-input-group-addon>
          </z-input-group>
          <z-input-group data-disabled="true">
            <input z-input id="input-search-disabled-28" placeholder="Search documentation..." disabled />
            <z-input-group-addon>
              <ng-icon name="lucideSearch" />
            </z-input-group-addon>
            <z-input-group-addon zAlign="inline-end">Disabled</z-input-group-addon>
          </z-input-group>
          <div z-field-group class="grid grid-cols-2 gap-4">
            <div z-field>
              <label z-field-label for="input-group-11">First Name</label>
              <z-input-group>
                <input z-input id="input-group-11" placeholder="First Name" />
                <z-input-group-addon zAlign="inline-end">
                  <ng-icon name="lucideInfo" />
                </z-input-group-addon>
              </z-input-group>
            </div>
            <div z-field>
              <label z-field-label for="input-group-12">Last Name</label>
              <z-input-group>
                <input z-input id="input-group-12" placeholder="Last Name" />
                <z-input-group-addon zAlign="inline-end">
                  <ng-icon name="lucideInfo" />
                </z-input-group-addon>
              </z-input-group>
            </div>
          </div>
          <div z-field data-disabled="true">
            <label z-field-label for="input-group-29">Loading ("data-disabled="true")</label>
            <z-input-group>
              <input z-input id="input-group-29" disabled value="shadcn" />
              <z-input-group-addon zAlign="inline-end">
                <z-spinner />
              </z-input-group-addon>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
        </div>
      </z-example>

      <z-example zTitle="In Card">
        <z-card class="w-full">
          <z-card-header>
            <z-card-title zTitle="Card with Input Group" />
            <z-card-description zDescription="This is a card with an input group." />
          </z-card-header>
          <z-card-content>
            <div z-field-group>
              <div z-field>
                <label z-field-label for="email-input">Email Address</label>
                <z-input-group>
                  <input z-input id="email-input" type="email" placeholder="you@example.com" />
                  <z-input-group-addon zAlign="inline-end">
                    <ng-icon name="lucideMail" />
                  </z-input-group-addon>
                </z-input-group>
              </div>
              <div z-field>
                <label z-field-label for="website-input">Website URL</label>
                <z-input-group>
                  <z-input-group-addon>
                    <z-input-group-text>https://</z-input-group-text>
                  </z-input-group-addon>
                  <input z-input id="website-input" placeholder="example.com" />
                  <z-input-group-addon zAlign="inline-end">
                    <ng-icon name="lucideExternalLink" />
                  </z-input-group-addon>
                </z-input-group>
              </div>
              <div z-field>
                <label z-field-label for="feedback-textarea">Feedback &amp; Comments</label>
                <z-input-group>
                  <textarea
                    z-textarea
                    id="feedback-textarea"
                    placeholder="Share your thoughts..."
                    class="min-h-[100px]"
                  ></textarea>
                  <z-input-group-addon zAlign="block-end">
                    <z-input-group-text>0/500 characters</z-input-group-text>
                  </z-input-group-addon>
                </z-input-group>
              </div>
            </div>
          </z-card-content>
          <z-card-footer class="justify-end gap-2">
            <button z-button zType="outline">Cancel</button>
            <button z-button>Submit</button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Textarea">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="textarea-header-footer-12">Default Textarea (No Input Group)</label>
            <textarea z-textarea id="textarea-header-footer-12" placeholder="Enter your text here..."></textarea>
          </div>
          <div z-field>
            <label z-field-label for="textarea-header-footer-13">Input Group</label>
            <z-input-group>
              <textarea z-textarea id="textarea-header-footer-13" placeholder="Enter your text here..."></textarea>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
          <div z-field data-invalid="true">
            <label z-field-label for="textarea-header-footer-14">Invalid</label>
            <z-input-group>
              <textarea
                z-textarea
                id="textarea-header-footer-14"
                placeholder="Enter your text here..."
                aria-invalid="true"
              ></textarea>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
          <div z-field data-disabled="true">
            <label z-field-label for="textarea-header-footer-15">Disabled</label>
            <z-input-group>
              <textarea
                z-textarea
                id="textarea-header-footer-15"
                placeholder="Enter your text here..."
                disabled
              ></textarea>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
          <div z-field>
            <label z-field-label for="prompt-31">Addon (block-start)</label>
            <z-input-group>
              <textarea z-textarea id="prompt-31"></textarea>
              <z-input-group-addon zAlign="block-start">
                <z-input-group-text>Ask, Search or Chat...</z-input-group-text>
                <ng-icon name="lucideInfo" class="text-muted-foreground ml-auto" />
              </z-input-group-addon>
            </z-input-group>
            <p z-field-description>This is a description of the input group.</p>
          </div>
          <div z-field>
            <label z-field-label for="textarea-header-footer-30">Addon (block-end)</label>
            <z-input-group>
              <textarea z-textarea id="textarea-header-footer-30" placeholder="Enter your text here..."></textarea>
              <z-input-group-addon zAlign="block-end">
                <z-input-group-text>0/280 characters</z-input-group-text>
                <button z-input-group-button zVariant="default" zSize="icon-xs" class="ml-auto rounded-full">
                  <ng-icon name="lucideArrowUp" />
                  <span class="sr-only">Send</span>
                </button>
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="textarea-comment-31">Addon (Buttons)</label>
            <z-input-group>
              <textarea
                z-textarea
                id="textarea-comment-31"
                placeholder="Share your thoughts..."
                class="min-h-[120px]"
              ></textarea>
              <z-input-group-addon zAlign="block-end">
                <button z-input-group-button zVariant="ghost" class="ml-auto" zSize="sm">Cancel</button>
                <button z-input-group-button zVariant="default" zSize="sm">Post Comment</button>
              </z-input-group-addon>
            </z-input-group>
          </div>
          <div z-field>
            <label z-field-label for="textarea-code-32">Code Editor</label>
            <z-input-group>
              <textarea
                z-textarea
                id="textarea-code-32"
                placeholder="console.log('Hello, world!');"
                class="min-h-[300px] py-3"
              ></textarea>
              <z-input-group-addon zAlign="block-start" class="border-b">
                <z-input-group-text class="font-mono font-medium">
                  <ng-icon name="lucideCode" />
                  script.js
                </z-input-group-text>
                <button z-input-group-button zSize="icon-xs" class="ml-auto">
                  <ng-icon name="lucideRefreshCw" />
                </button>
                <button z-input-group-button zSize="icon-xs" zVariant="ghost">
                  <ng-icon name="lucideCopy" />
                </button>
              </z-input-group-addon>
              <z-input-group-addon zAlign="block-end" class="border-t">
                <z-input-group-text>Line 1, Column 1</z-input-group-text>
                <z-input-group-text class="ml-auto">JavaScript</z-input-group-text>
              </z-input-group-addon>
            </z-input-group>
          </div>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class InputGroupExampleComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly countryCodes = COUNTRY_CODES;
  protected readonly country = signal('+1');

  protected toast(message: string): void {
    this.sonner.show(message);
  }
}
