import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTabsImports } from '@zard/components/tabs/tabs.imports';
import { renderTokenBlocks } from '@zard/design';

import { copyText } from '../lib/clipboard';
import {
  DEFAULT_PACKAGE_MANAGER,
  PACKAGE_MANAGERS,
  TEMPLATES,
  existingProjectCommand,
  isPackageManager,
  newProjectCommand,
  type ApplyScope,
  type CreateTemplate,
  type PackageManager,
} from '../lib/create-commands';
import { CreateShellService } from '../services/create-shell.service';
import { CreateStateService } from '../services/create-state.service';

const PACKAGE_MANAGER_KEY = 'zard-create-package-manager';
const COPIED_MS = 2000;

const SCOPES: readonly { value: ApplyScope; label: string; description: string }[] = [
  { value: 'full', label: 'Full preset', description: 'Style, theme, fonts and icons' },
  { value: 'theme', label: 'Theme only', description: 'Colors, radius and menu' },
  { value: 'font', label: 'Fonts only', description: 'Body and heading fonts' },
];

/**
 * "Get Code": the one command that takes the design home. A new project, an existing project (the whole preset, the
 * theme alone or the fonts alone) and the theme's CSS. The commands are exactly what `zard-cli` accepts.
 */
@Component({
  selector: 'z-create-get-code',
  imports: [NgTemplateOutlet, ZardButtonComponent, ZardDialogImports, ZardSwitchComponent, ...ZardTabsImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-dialog
      class="dark gap-4 sm:max-w-md"
      [zVisible]="shell.getCodeOpen()"
      (zVisibleChange)="shell.getCodeOpen.set($event)"
    >
      <z-dialog-header>
        <z-dialog-title>Get Code</z-dialog-title>
        <z-dialog-description>
          Take this design home: a new project, an existing one, or just the theme.
        </z-dialog-description>
      </z-dialog-header>

      <z-tab-group>
        <z-tab label="New Project">
          <div class="grid gap-4 pt-3" data-tab="new-project">
            <div class="grid gap-2" role="radiogroup" aria-label="Template">
              <span class="text-muted-foreground text-xs font-medium">Template</span>
              <div class="grid grid-cols-2 gap-2">
                @for (item of templates; track item.value) {
                  <button
                    type="button"
                    role="radio"
                    class="ring-foreground/10 hover:bg-muted aria-checked:bg-muted aria-checked:ring-foreground/40 rounded-lg p-3 text-left text-sm ring-1 outline-none focus-visible:ring-2"
                    [attr.aria-checked]="template() === item.value"
                    [attr.data-template]="item.value"
                    (click)="template.set(item.value)"
                  >
                    <span class="block font-medium">{{ item.label }}</span>
                    <span class="text-muted-foreground block text-xs">{{ item.description }}</span>
                  </button>
                }
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 text-sm">
              <span aria-hidden="true">Use pointer on buttons</span>
              <z-switch [zChecked]="pointer()" (zCheckedChange)="pointer.set($event)">
                <span class="sr-only">Use pointer on buttons</span>
              </z-switch>
            </div>
            <div class="flex items-center justify-between gap-3 text-sm">
              <span aria-hidden="true">Enable RTL support</span>
              <z-switch [zChecked]="rtl()" (zCheckedChange)="rtl.set($event)">
                <span class="sr-only">Enable RTL support</span>
              </z-switch>
            </div>

            <ng-container *ngTemplateOutlet="commandBlock; context: { command: newCommand(), label: 'Copy Command' }" />
          </div>
        </z-tab>

        <z-tab label="Existing Project">
          <div class="grid gap-4 pt-3" data-tab="existing-project">
            <div class="grid gap-1">
              <span class="text-sm font-medium">Apply Preset</span>
              <span class="text-muted-foreground text-xs">Pick which parts of the preset to apply.</span>
            </div>
            <div class="grid gap-2" role="radiogroup" aria-label="Apply">
              @for (item of scopes; track item.value) {
                <button
                  type="button"
                  role="radio"
                  class="ring-foreground/10 hover:bg-muted aria-checked:bg-muted aria-checked:ring-foreground/40 rounded-lg p-3 text-left text-sm ring-1 outline-none focus-visible:ring-2"
                  [attr.aria-checked]="scope() === item.value"
                  [attr.data-scope]="item.value"
                  (click)="scope.set(item.value)"
                >
                  <span class="block font-medium">{{ item.label }}</span>
                  <span class="text-muted-foreground block text-xs">{{ item.description }}</span>
                </button>
              }
            </div>
            <ng-container
              *ngTemplateOutlet="commandBlock; context: { command: existingCommand(), label: 'Copy Command' }"
            />
          </div>
        </z-tab>

        <z-tab label="Theme">
          <div class="grid gap-3 pt-3" data-tab="theme">
            <span class="text-muted-foreground font-mono text-xs">styles.css</span>
            <pre
              class="bg-muted/50 ring-foreground/10 max-h-72 overflow-auto rounded-lg p-3 text-xs ring-1"
              tabindex="0"
            ><code data-testid="theme-css">{{ themeCss() }}</code></pre>
            <button type="button" z-button class="w-full" (click)="copy('theme', themeCss())">
              {{ copied() === 'theme' ? 'Copied' : 'Copy Theme' }}
            </button>
          </div>
        </z-tab>
      </z-tab-group>
    </z-dialog>

    <ng-template #commandBlock let-command="command" let-label="label">
      <div class="grid gap-2">
        <div class="bg-muted/50 flex gap-1 rounded-lg p-1" role="tablist" aria-label="Package manager">
          @for (manager of managers; track manager) {
            <button
              type="button"
              role="tab"
              class="hover:text-foreground text-muted-foreground aria-selected:bg-background aria-selected:text-foreground flex-1 rounded-md px-2 py-1 text-xs font-medium outline-none focus-visible:ring-2"
              [attr.aria-selected]="packageManager() === manager"
              [attr.data-manager]="manager"
              (click)="setManager(manager)"
            >
              {{ manager }}
            </button>
          }
        </div>
        <pre
          class="bg-muted/50 ring-foreground/10 rounded-lg p-3 text-xs break-all whitespace-pre-wrap ring-1"
          role="tabpanel"
          tabindex="0"
          aria-label="Command"
        ><code data-testid="command">{{ command }}</code></pre>
        <button type="button" z-button class="w-full" (click)="copy('command', command)">
          {{ copied() === 'command' ? 'Copied' : label }}
        </button>
      </div>
    </ng-template>
  `,
})
export class CreateGetCodeComponent {
  protected readonly shell = inject(CreateShellService);
  private readonly state = inject(CreateStateService);
  private readonly document = inject(DOCUMENT);

  protected readonly templates = TEMPLATES;
  protected readonly scopes = SCOPES;
  protected readonly managers = PACKAGE_MANAGERS;

  protected readonly template = signal<CreateTemplate>('angular');
  protected readonly pointer = signal(false);
  protected readonly rtl = signal(false);
  protected readonly scope = signal<ApplyScope>('full');
  protected readonly packageManager = signal<PackageManager>(DEFAULT_PACKAGE_MANAGER);
  protected readonly copied = signal<'command' | 'theme' | null>(null);

  protected readonly newCommand = computed(() =>
    newProjectCommand({
      manager: this.packageManager(),
      preset: this.state.preset(),
      template: this.template(),
      pointer: this.pointer(),
      rtl: this.rtl(),
    }),
  );

  protected readonly existingCommand = computed(() =>
    existingProjectCommand({ manager: this.packageManager(), preset: this.state.preset(), scope: this.scope() }),
  );

  protected readonly themeCss = computed(() => renderTokenBlocks(this.state.design()));

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Read after hydration: the server has no storage, and the first paint must match what it rendered.
    afterNextRender(() => {
      try {
        const stored = this.document.defaultView?.localStorage.getItem(PACKAGE_MANAGER_KEY);
        if (isPackageManager(stored)) this.packageManager.set(stored);
      } catch {
        // Blocked storage: keep the default.
      }
    });
  }

  protected setManager(manager: PackageManager): void {
    this.packageManager.set(manager);

    try {
      this.document.defaultView?.localStorage.setItem(PACKAGE_MANAGER_KEY, manager);
    } catch {
      // The choice still applies for this visit.
    }
  }

  protected async copy(what: 'command' | 'theme', text: string): Promise<void> {
    if (!(await copyText(this.document, text))) return;

    this.copied.set(what);
    if (this.copiedTimer) clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(null), COPIED_MS);
  }
}
