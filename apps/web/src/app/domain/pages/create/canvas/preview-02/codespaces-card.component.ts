import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideContainer,
  lucideCopy,
  lucideDownload,
  lucideInfo,
  lucideMonitor,
  lucideMoreHorizontal,
  lucidePlus,
  lucideServer,
  lucideShare,
  lucideZap,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSpinnerComponent } from '@zard/components/spinner/spinner.component';
import { ZardTabsImports } from '@zard/components/tabs/tabs.imports';
import { ZardTooltipImports } from '@zard/components/tooltip';

const CLONE_OPTIONS = [
  { label: 'HTTPS', id: 'p2-https-url', name: 'HTTPS URL', value: 'https://github.com/shadcn-ui/ui.git' },
  { label: 'SSH', id: 'p2-ssh-url', name: 'SSH URL', value: 'git@github.com:shadcn-ui/ui.git' },
  { label: 'GitHub CLI', id: 'p2-cli-command', name: 'CLI Command', value: 'gh repo clone shadcn-ui/ui' },
] as const;

@Component({
  selector: 'z-preview-02-codespaces-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardCardImports,
    ZardDropdownImports,
    ZardEmptyComponent,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardItemImports,
    ZardSeparatorComponent,
    ZardSpinnerComponent,
    ZardTabsImports,
    ZardTooltipImports,
  ],
  viewProviders: [
    provideIcons({
      lucideContainer,
      lucideCopy,
      lucideDownload,
      lucideInfo,
      lucideMonitor,
      lucideMoreHorizontal,
      lucidePlus,
      lucideServer,
      lucideShare,
      lucideZap,
    }),
  ],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content>
        <z-tab-group class="[&>nav]:w-full">
          <z-tab label="Codespaces">
            <div z-item zSize="sm" class="px-1 pt-2">
              <div z-item-content>
                <div z-item-title>Codespaces</div>
                <p z-item-description>Your workspaces in the cloud</p>
              </div>
              <div z-item-actions>
                <button
                  type="button"
                  z-button
                  zType="ghost"
                  zSize="icon-sm"
                  zTooltip="Create a codespace on main"
                  zPosition="bottom"
                  aria-label="Create a codespace on main"
                >
                  <ng-icon name="lucidePlus" />
                </button>
                <button
                  type="button"
                  z-button
                  zType="ghost"
                  zSize="icon-sm"
                  aria-label="More actions"
                  z-dropdown
                  [zDropdownMenu]="menu"
                >
                  <ng-icon name="lucideMoreHorizontal" />
                </button>
                <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end" class="w-56">
                  <z-dropdown-menu-group>
                    <z-dropdown-menu-item>
                      <ng-icon name="lucidePlus" />
                      New with options...
                    </z-dropdown-menu-item>
                    <z-dropdown-menu-item>
                      <ng-icon name="lucideContainer" />
                      Configure container
                    </z-dropdown-menu-item>
                    <z-dropdown-menu-item>
                      <ng-icon name="lucideZap" />
                      Set up prebuilds
                    </z-dropdown-menu-item>
                  </z-dropdown-menu-group>
                  <z-dropdown-menu-separator />
                  <z-dropdown-menu-group>
                    <z-dropdown-menu-item>
                      <ng-icon name="lucideServer" />
                      Manage codespaces
                    </z-dropdown-menu-item>
                    <z-dropdown-menu-item>
                      <ng-icon name="lucideShare" />
                      Share deep link
                    </z-dropdown-menu-item>
                    <z-dropdown-menu-item>
                      <ng-icon name="lucideInfo" />
                      What are codespaces?
                    </z-dropdown-menu-item>
                  </z-dropdown-menu-group>
                </z-dropdown-menu-content>
              </div>
            </div>
            <z-separator class="-mx-2 my-2 w-auto!" />
            <z-empty
              class="p-4"
              zIcon="lucideServer"
              zTitle="No codespaces"
              zDescription="You don't have any codespaces with this repository checked out"
              [zActions]="[createAction, learnMore]"
            />
            <ng-template #createAction>
              <button type="button" z-button zSize="sm" [zDisabled]="creating()" (click)="createCodespace()">
                @if (creating()) {
                  <z-spinner data-icon="inline-start" />
                }
                Create Codespace
              </button>
            </ng-template>
            <ng-template #learnMore>
              <a
                href="#learn-more"
                class="text-muted-foreground text-xs underline underline-offset-4"
                (click)="$event.preventDefault()"
              >
                Learn more about codespaces
              </a>
            </ng-template>
            <z-separator class="-mx-2 my-2 w-auto!" />
            <!-- prettier-ignore -->
            <div class="text-muted-foreground p-1.5 text-xs">
              Codespace usage for this repository is paid for by <span class="font-medium">shadcn</span>.
            </div>
          </z-tab>
          <z-tab label="Local">
            <z-tab-group
              zVariant="line"
              class="[&>nav]:w-full [&>nav]:justify-start [&>nav]:border-b [&>nav>button]:flex-0"
            >
              @for (option of cloneOptions; track option.id) {
                <z-tab [label]="option.label">
                  <div class="bg-muted/30 rounded-md border p-2">
                    <z-field class="gap-2">
                      <label z-field-label [for]="option.id" class="sr-only">{{ option.name }}</label>
                      <z-input-group>
                        <z-input-group-addon zAlign="inline-end">
                          <button type="button" z-input-group-button zVariant="ghost" zSize="icon-xs" aria-label="Copy">
                            <ng-icon name="lucideCopy" />
                          </button>
                        </z-input-group-addon>
                        <input z-input [id]="option.id" [value]="option.value" readonly />
                      </z-input-group>
                      <p z-field-description>
                        @switch (option.id) {
                          @case ('p2-https-url') {
                            Clone using the web URL.
                          }
                          @case ('p2-ssh-url') {
                            Use a password-protected SSH key.
                          }
                          @default {
                            Work fast with our official CLI.
                            <a href="#learn-more" (click)="$event.preventDefault()">Learn more</a>
                          }
                        }
                      </p>
                    </z-field>
                  </div>
                </z-tab>
              }
            </z-tab-group>
            <z-separator class="-mx-2 my-2 w-auto!" />
            <div class="flex flex-col">
              <button type="button" z-button zType="ghost" zSize="sm" class="justify-start gap-1.5">
                <ng-icon name="lucideMonitor" data-icon="inline-start" />
                Open with GitHub Desktop
              </button>
              <button type="button" z-button zType="ghost" zSize="sm" class="justify-start gap-1.5">
                <ng-icon name="lucideDownload" data-icon="inline-start" />
                Download ZIP
              </button>
            </div>
          </z-tab>
        </z-tab-group>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02CodespacesCardComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cloneOptions = CLONE_OPTIONS;
  protected readonly creating = signal(false);

  protected createCodespace(): void {
    this.creating.set(true);
    const timer = setTimeout(() => this.creating.set(false), 2000);
    this.destroyRef.onDestroy(() => clearTimeout(timer));
  }
}
