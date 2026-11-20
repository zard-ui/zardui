import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCheckboxComponent } from '@zard/components/checkbox';
import { ZardDialogImports } from '@zard/components/dialog';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardKbdComponent } from '@zard/components/kbd';
import { ZardSelectImports } from '@zard/components/select';
import { ZardSwitchComponent } from '@zard/components/switch';
import { ZardTabsImports } from '@zard/components/tabs';
import { ZardTextareaComponent } from '@zard/components/textarea';
import { ZardTooltipImports } from '@zard/components/tooltip';

import { ExampleImports } from './example.component';

const PARAGRAPHS = Array.from(
  { length: 10 },
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
);

const SPOKEN_LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Italian', value: 'it' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Telugu', value: 'te' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Malayalam', value: 'ml' },
] as const;

const VOICES = [
  { label: 'Samantha', value: 'samantha' },
  { label: 'Alex', value: 'alex' },
  { label: 'Fred', value: 'fred' },
  { label: 'Victoria', value: 'victoria' },
  { label: 'Tom', value: 'tom' },
  { label: 'Karen', value: 'karen' },
  { label: 'Sam', value: 'sam' },
  { label: 'Daniel', value: 'daniel' },
] as const;

const ACCENT_COLORS = [
  { label: 'Default', value: 'default', dot: 'bg-neutral-500 dark:bg-neutral-400' },
  { label: 'Red', value: 'red', dot: 'bg-red-500 dark:bg-red-400' },
  { label: 'Blue', value: 'blue', dot: 'bg-blue-500 dark:bg-blue-400' },
  { label: 'Green', value: 'green', dot: 'bg-green-500 dark:bg-green-400' },
  { label: 'Purple', value: 'purple', dot: 'bg-purple-500 dark:bg-purple-400' },
  { label: 'Pink', value: 'pink', dot: 'bg-pink-500 dark:bg-pink-400' },
] as const;

type DialogName = 'form' | 'scrollable' | 'sticky' | 'no-close' | 'chat';

const SCROLL_CLASSES =
  'no-scrollbar style-vega:-mx-6 style-vega:px-6 style-nova:-mx-4 style-nova:px-4 style-lyra:-mx-4 style-lyra:px-4 style-maia:-mx-6 style-maia:px-6 style-mira:-mx-4 style-mira:px-4 style-luma:-mx-6 style-luma:px-6 style-rhea:-mx-6 style-rhea:px-6 max-h-[70vh] overflow-y-auto';

const TAB_PANEL_CLASSES =
  'style-vega:min-h-[550px] style-vega:rounded-lg style-vega:p-6 style-nova:min-h-[460px] style-nova:rounded-lg style-nova:p-4 style-lyra:min-h-[450px] style-lyra:rounded-none style-lyra:p-4 style-maia:min-h-[550px] style-maia:rounded-xl style-maia:p-6 style-mira:min-h-[450px] style-mira:rounded-md style-mira:p-4 style-luma:min-h-[550px] style-luma:rounded-xl style-luma:p-6 style-rhea:min-h-[480px] style-rhea:rounded-2xl style-rhea:p-6 border **:data-[slot=select-trigger]:min-w-[125px]';

/** shadcn/ui's `dialog-example`, in zard. */
@Component({
  selector: 'z-dialog-example',
  imports: [
    FormsModule,
    NgIcon,
    ExampleImports,
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardDialogImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardKbdComponent,
    ZardSelectImports,
    ZardSwitchComponent,
    ZardTabsImports,
    ZardTextareaComponent,
    ZardTooltipImports,
  ],
  viewProviders: [provideIcons({ lucideInfo })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="With Form" zClass="items-center justify-center">
        <button type="button" z-button zType="outline" (click)="open.set('form')">Edit Profile</button>
        <z-dialog [zVisible]="open() === 'form'" (zVisibleChange)="toggle('form', $event)">
          <z-dialog-header>
            <z-dialog-title>Edit profile</z-dialog-title>
            <z-dialog-description>
              Make changes to your profile here. Click save when you're done. Your profile will be updated immediately.
            </z-dialog-description>
          </z-dialog-header>
          <div z-field-group>
            <div z-field>
              <label z-field-label for="name-1">Name</label>
              <input z-input id="name-1" name="name" value="Pedro Duarte" />
            </div>
            <div z-field>
              <label z-field-label for="username-1">Username</label>
              <input z-input id="username-1" name="username" value="@peduarte" />
            </div>
          </div>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
            <button type="submit" z-button>Save changes</button>
          </z-dialog-footer>
        </z-dialog>
      </z-example>

      <z-example zTitle="Scrollable Content" zClass="items-center justify-center">
        <button type="button" z-button zType="outline" (click)="open.set('scrollable')">Scrollable Content</button>
        <z-dialog [zVisible]="open() === 'scrollable'" (zVisibleChange)="toggle('scrollable', $event)">
          <z-dialog-header>
            <z-dialog-title>Scrollable Content</z-dialog-title>
            <z-dialog-description>This is a dialog with scrollable content.</z-dialog-description>
          </z-dialog-header>
          <div [class]="scrollClasses">
            @for (paragraph of paragraphs; track $index) {
              <p class="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal">{{ paragraph }}</p>
            }
          </div>
        </z-dialog>
      </z-example>

      <z-example zTitle="With Sticky Footer" zClass="items-center justify-center">
        <button type="button" z-button zType="outline" (click)="open.set('sticky')">Sticky Footer</button>
        <z-dialog [zVisible]="open() === 'sticky'" (zVisibleChange)="toggle('sticky', $event)">
          <z-dialog-header>
            <z-dialog-title>Scrollable Content</z-dialog-title>
            <z-dialog-description>This is a dialog with scrollable content.</z-dialog-description>
          </z-dialog-header>
          <div [class]="scrollClasses">
            @for (paragraph of paragraphs; track $index) {
              <p class="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal">{{ paragraph }}</p>
            }
          </div>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Close</button>
          </z-dialog-footer>
        </z-dialog>
      </z-example>

      <z-example zTitle="No Close Button" zClass="items-center justify-center">
        <button type="button" z-button zType="outline" (click)="open.set('no-close')">No Close Button</button>
        <z-dialog [zVisible]="open() === 'no-close'" (zVisibleChange)="toggle('no-close', $event)" [zClosable]="false">
          <z-dialog-header>
            <z-dialog-title>No Close Button</z-dialog-title>
            <z-dialog-description>
              This dialog doesn't have a close button in the top-right corner.
            </z-dialog-description>
          </z-dialog-header>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Close</button>
          </z-dialog-footer>
        </z-dialog>
      </z-example>

      <z-example zTitle="Chat Settings" zClass="items-center justify-center">
        <button type="button" z-button zType="outline" (click)="open.set('chat')">Chat Settings</button>
        <z-dialog [zVisible]="open() === 'chat'" (zVisibleChange)="toggle('chat', $event)" class="min-w-md">
          <z-dialog-header>
            <z-dialog-title>Chat Settings</z-dialog-title>
            <z-dialog-description>
              Customize your chat settings: theme, accent color, spoken language, voice, personality, and custom
              instructions.
            </z-dialog-description>
          </z-dialog-header>
          <div class="flex flex-col gap-4">
            <z-tab-group>
              <z-tab label="General">
                <div [class]="tabPanelClasses">
                  <fieldset z-field-set>
                    <div z-field-group>
                      <div z-field zOrientation="horizontal">
                        <label for="dialog-theme-191" z-field-label>Theme</label>
                        <z-select
                          id="dialog-theme-191"
                          zPlaceholder="Select"
                          zPosition="popper"
                          zAlign="end"
                          [(zValue)]="theme"
                        >
                          <z-select-group>
                            <z-select-item zValue="light">Light</z-select-item>
                            <z-select-item zValue="dark">Dark</z-select-item>
                            <z-select-item zValue="system">System</z-select-item>
                          </z-select-group>
                        </z-select>
                      </div>
                      <z-field-separator />
                      <div z-field zOrientation="horizontal">
                        <label for="dialog-accent-color-202" z-field-label>Accent Color</label>
                        <z-select
                          id="dialog-accent-color-202"
                          zPlaceholder="Select"
                          zPosition="popper"
                          zAlign="end"
                          [(zValue)]="accentColor"
                        >
                          <z-select-group>
                            @for (color of accentColors; track color.value) {
                              <z-select-item [zValue]="color.value">
                                <div class="size-3 rounded-full" [class]="color.dot"></div>
                                {{ color.label }}
                              </z-select-item>
                            }
                          </z-select-group>
                        </z-select>
                      </div>
                      <z-field-separator />
                      <div z-field zOrientation="responsive">
                        <div z-field-content>
                          <label for="dialog-spoken-language-217" z-field-label>Spoken Language</label>
                          <p z-field-description>
                            For best results, select the language you mainly speak. If it's not listed, it may still be
                            supported via auto-detection.
                          </p>
                        </div>
                        <z-select
                          id="dialog-spoken-language-217"
                          zPlaceholder="Select"
                          zPosition="item-aligned"
                          zAlign="end"
                          [(zValue)]="spokenLanguage"
                        >
                          <z-select-group>
                            <z-select-item zValue="auto">Auto</z-select-item>
                          </z-select-group>
                          <z-select-separator />
                          <z-select-group>
                            @for (language of spokenLanguages; track language.value) {
                              <z-select-item [zValue]="language.value">{{ language.label }}</z-select-item>
                            }
                          </z-select-group>
                        </z-select>
                      </div>
                      <z-field-separator />
                      <div z-field zOrientation="horizontal">
                        <label for="dialog-voice-242" z-field-label>Voice</label>
                        <z-select
                          id="dialog-voice-242"
                          zPlaceholder="Select"
                          zPosition="item-aligned"
                          zAlign="end"
                          [(zValue)]="voice"
                        >
                          <z-select-group>
                            @for (item of voices; track item.value) {
                              <z-select-item [zValue]="item.value">{{ item.label }}</z-select-item>
                            }
                          </z-select-group>
                        </z-select>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </z-tab>

              <z-tab label="Notifications">
                <div [class]="tabPanelClasses">
                  <div z-field-group>
                    <fieldset z-field-set>
                      <label for="dialog-responses-260" z-field-label>Responses</label>
                      <p z-field-description>
                        Get notified when ChatGPT responds to requests that take time, like research or image
                        generation.
                      </p>
                      <div z-field-group data-slot="checkbox-group">
                        <div z-field zOrientation="horizontal">
                          <z-checkbox id="dialog-responses-260" zId="push" [ngModel]="true" zDisabled />
                          <label z-field-label for="push" class="font-normal">Push notifications</label>
                        </div>
                      </div>
                    </fieldset>
                    <z-field-separator />
                    <fieldset z-field-set>
                      <label for="dialog-tasks-274" z-field-label>Tasks</label>
                      <p z-field-description>
                        Get notified when tasks you've created have updates.
                        <a href="#" (click)="$event.preventDefault()">Manage tasks</a>
                      </p>
                      <div z-field-group data-slot="checkbox-group">
                        <div z-field zOrientation="horizontal">
                          <z-checkbox id="dialog-tasks-274" zId="push-tasks" />
                          <label z-field-label for="push-tasks" class="font-normal">Push notifications</label>
                        </div>
                        <div z-field zOrientation="horizontal">
                          <z-checkbox zId="email-tasks" />
                          <label z-field-label for="email-tasks" class="font-normal">Email notifications</label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </z-tab>

              <z-tab label="Personalization">
                <div [class]="tabPanelClasses">
                  <div z-field-group>
                    <div z-field zOrientation="responsive">
                      <label z-field-label for="nickname">Nickname</label>
                      <z-input-group>
                        <input z-input id="nickname" placeholder="Broski" class="@md/field-group:max-w-[200px]" />
                        <z-input-group-addon zAlign="inline-end">
                          <button type="button" z-input-group-button zSize="icon-xs" [zTooltip]="nicknameTip">
                            <ng-icon name="lucideInfo" />
                          </button>
                        </z-input-group-addon>
                      </z-input-group>
                    </div>
                    <z-field-separator />
                    <div z-field zOrientation="responsive" class="@md/field-group:flex-col @2xl/field-group:flex-row">
                      <div z-field-content>
                        <label z-field-label for="about">More about you</label>
                        <p z-field-description>
                          Tell us more about yourself. This will be used to help us personalize your experience.
                        </p>
                      </div>
                      <textarea
                        z-textarea
                        id="about"
                        placeholder="I'm a software engineer..."
                        class="min-h-[120px] @md/field-group:min-w-full @2xl/field-group:min-w-[300px]"
                      ></textarea>
                    </div>
                    <z-field-separator />
                    <z-field-label>
                      <div z-field zOrientation="horizontal">
                        <div z-field-content>
                          <label z-field-label for="customization">Enable customizations</label>
                          <p z-field-description>Enable customizations to make ChatGPT more personalized.</p>
                        </div>
                        <z-switch zId="customization" [zChecked]="true" />
                      </div>
                    </z-field-label>
                  </div>
                </div>
              </z-tab>

              <z-tab label="Security">
                <div [class]="tabPanelClasses">
                  <div z-field-group>
                    <div z-field zOrientation="horizontal">
                      <div z-field-content>
                        <label z-field-label for="2fa">Multi-factor authentication</label>
                        <p z-field-description>
                          Enable multi-factor authentication to secure your account. If you do not have a two-factor
                          authentication device, you can use a one-time code sent to your email.
                        </p>
                      </div>
                      <z-switch zId="2fa" />
                    </div>
                    <z-field-separator />
                    <div z-field zOrientation="horizontal">
                      <div z-field-content>
                        <div z-field-title>Log out</div>
                        <p z-field-description>Log out of your account on this device.</p>
                      </div>
                      <button type="button" z-button zType="outline" zSize="sm">Log Out</button>
                    </div>
                    <z-field-separator />
                    <div z-field zOrientation="horizontal">
                      <div z-field-content>
                        <div z-field-title>Log out of all devices</div>
                        <p z-field-description>
                          This will log you out of all devices, including the current session. It may take up to 30
                          minutes for the changes to take effect.
                        </p>
                      </div>
                      <button type="button" z-button zType="outline" zSize="sm">Log Out All</button>
                    </div>
                  </div>
                </div>
              </z-tab>
            </z-tab-group>
          </div>
        </z-dialog>
      </z-example>
    </z-example-wrapper>

    <ng-template #nicknameTip>
      <span class="flex items-center gap-2">
        Used to identify you in the chat.
        <z-kbd>N</z-kbd>
      </span>
    </ng-template>
  `,
})
export class DialogExampleComponent {
  protected readonly paragraphs = PARAGRAPHS;
  protected readonly spokenLanguages = SPOKEN_LANGUAGES;
  protected readonly voices = VOICES;
  protected readonly accentColors = ACCENT_COLORS;
  protected readonly scrollClasses = SCROLL_CLASSES;
  protected readonly tabPanelClasses = TAB_PANEL_CLASSES;

  protected readonly open = signal<DialogName | null>(null);
  protected readonly theme = signal('system');
  protected readonly accentColor = signal('default');
  protected readonly spokenLanguage = signal('en');
  protected readonly voice = signal('samantha');

  protected toggle(name: DialogName, visible: boolean): void {
    this.open.set(visible ? name : null);
  }
}
