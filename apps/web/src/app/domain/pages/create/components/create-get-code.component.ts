import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideGlobe, lucideMousePointerClick } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardFieldImports } from '@zard/components/field';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
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

type GetCodeTab = 'new-project' | 'existing-project' | 'theme';
type CopyTarget = 'command' | 'theme';

const TABS: readonly { value: GetCodeTab; label: string }[] = [
  { value: 'new-project', label: 'New Project' },
  { value: 'existing-project', label: 'Existing Project' },
  { value: 'theme', label: 'Theme' },
];

const SCOPES: readonly { value: ApplyScope; label: string; description: string }[] = [
  {
    value: 'full',
    label: 'Full preset',
    description: 'Everything from the preset: style, theme, fonts and icons. Your own CSS is kept.',
  },
  {
    value: 'theme',
    label: 'Theme only',
    description: 'Theme tokens only: colors, radius and menu accent. Components stay as they are.',
  },
  {
    value: 'font',
    label: 'Fonts only',
    description: 'Only the preset fonts for body and headings. Components stay as they are.',
  },
];

/**
 * "Get Code": the one command that takes the design home. A new project, an existing project (the whole preset, the
 * theme alone or the fonts alone) and the theme's CSS. The commands are exactly what `zard-cli` accepts, and the
 * New Project one runs without a single question: it carries the project name, the preset and the template.
 *
 * The layout follows shadcn's `project-form.tsx`: a dialog 64px from the top with pill tabs in the header, sections
 * split by full-bleed separators, and a command box whose line scrolls sideways instead of wrapping.
 */
@Component({
  selector: 'z-create-get-code',
  imports: [NgIcon, NgTemplateOutlet, ZardButtonComponent, ZardDialogImports, ZardFieldImports, ZardSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCheck, lucideCopy, lucideGlobe, lucideMousePointerClick })],
  template: `
    <z-dialog
      class="dark top-16 flex max-h-[calc(100svh-2rem)] translate-y-0 flex-col gap-0 rounded-2xl p-0 shadow-xl **:data-[slot=dialog-close]:end-4 **:data-[slot=dialog-close]:top-4.5 **:data-[slot=field-separator]:h-2 sm:max-w-md"
      [zVisible]="shell.getCodeOpen()"
      (zVisibleChange)="shell.getCodeOpen.set($event)"
    >
      <z-dialog-header class="sr-only">
        <z-dialog-title>Get Code</z-dialog-title>
        <z-dialog-description>
          Take this design home: a new project, an existing one, or just the theme.
        </z-dialog-description>
      </z-dialog-header>

      <div class="flex min-w-0 flex-1 flex-col gap-0 overflow-hidden rounded-2xl">
        <div class="flex flex-col border-b px-6 py-5">
          <div class="flex gap-2" role="tablist" aria-label="Project type">
            @for (item of tabs; track item.value) {
              <button
                type="button"
                role="tab"
                class="text-foreground hover:bg-muted focus-visible:ring-ring/50 h-8 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-2 aria-selected:bg-neutral-700/70"
                [attr.aria-selected]="tab() === item.value"
                [attr.data-get-code-tab]="item.value"
                (click)="tab.set(item.value)"
              >
                {{ item.label }}
              </button>
            }
          </div>
        </div>

        @switch (tab()) {
          @case ('new-project') {
            <div class="no-scrollbar overflow-y-auto" role="tabpanel" aria-label="New Project" data-tab="new-project">
              <div z-field-group class="px-6 py-4">
                <div z-field class="gap-3" role="radiogroup" aria-label="Template">
                  <span z-field-label>Template</span>
                  <div class="grid grid-cols-2 gap-2">
                    @for (item of templates; track item.value) {
                      <button
                        type="button"
                        role="radio"
                        class="focus-visible:ring-ring/50 flex items-center gap-2 rounded-md border px-5 py-4 text-left text-sm font-medium transition-colors duration-150 outline-none hover:bg-neutral-700/45 focus-visible:ring-2 aria-checked:bg-neutral-700/45"
                        [attr.aria-checked]="template() === item.value"
                        [attr.data-template]="item.value"
                        (click)="template.set(item.value)"
                      >
                        <span class="size-4 shrink-0 text-neutral-100" aria-hidden="true">
                          <ng-container *ngTemplateOutlet="logo; context: { name: item.value }" />
                        </span>
                        {{ item.label }}
                      </button>
                    }
                  </div>
                </div>

                <z-field-separator class="-mx-6" />

                <fieldset z-field-set>
                  <div class="flex items-center justify-between gap-3 text-sm">
                    <span
                      class="flex cursor-pointer items-center gap-2 font-medium"
                      aria-hidden="true"
                      (click)="pointer.set(!pointer())"
                    >
                      <ng-icon name="lucideMousePointerClick" class="size-4!" />
                      Use pointer on buttons
                    </span>
                    <z-switch [zChecked]="pointer()" (zCheckedChange)="pointer.set($event)">
                      <span class="sr-only">Use pointer on buttons</span>
                    </z-switch>
                  </div>
                  <z-field-separator class="-mx-6" />
                  <div class="flex items-center justify-between gap-3 text-sm">
                    <span
                      class="flex cursor-pointer items-center gap-2 font-medium"
                      aria-hidden="true"
                      (click)="rtl.set(!rtl())"
                    >
                      <ng-icon name="lucideGlobe" class="size-4!" />
                      Enable RTL support
                    </span>
                    <z-switch [zChecked]="rtl()" (zCheckedChange)="rtl.set($event)">
                      <span class="sr-only">Enable RTL support</span>
                    </z-switch>
                  </div>
                </fieldset>
              </div>
              <ng-container *ngTemplateOutlet="commandFooter; context: { command: newCommand() }" />
            </div>
          }
          @case ('existing-project') {
            <div
              class="no-scrollbar overflow-y-auto"
              role="tabpanel"
              aria-label="Existing Project"
              data-tab="existing-project"
            >
              <div z-field-group class="px-6 py-4">
                <fieldset z-field-set class="gap-3">
                  <legend z-field-legend zVariant="label">Apply Preset</legend>
                  <p z-field-description>
                    Pick which parts of the preset to apply. For a project that already uses zard-cli (run init first if
                    not).
                  </p>
                  <div class="grid gap-2" role="radiogroup" aria-label="Apply">
                    @for (item of scopes; track item.value) {
                      <button
                        type="button"
                        role="radio"
                        class="focus-visible:ring-ring/50 flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors duration-150 outline-none hover:bg-neutral-700/45 focus-visible:ring-2 aria-checked:bg-neutral-700/45"
                        [attr.aria-checked]="scope() === item.value"
                        [attr.data-scope]="item.value"
                        (click)="scope.set(item.value)"
                      >
                        <span
                          class="border-input mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border"
                          aria-hidden="true"
                        >
                          @if (scope() === item.value) {
                            <span class="bg-primary size-2 rounded-full"></span>
                          }
                        </span>
                        <span class="grid gap-0.5">
                          <span class="font-medium">{{ item.label }}</span>
                          <span class="text-muted-foreground">{{ item.description }}</span>
                        </span>
                      </button>
                    }
                  </div>
                </fieldset>
              </div>
              <ng-container *ngTemplateOutlet="commandFooter; context: { command: existingCommand() }" />
            </div>
          }
          @case ('theme') {
            <div class="no-scrollbar overflow-y-auto" role="tabpanel" aria-label="Theme" data-tab="theme">
              <div z-field-group class="min-w-0 px-6 py-4">
                <fieldset z-field-set class="min-w-0 gap-3">
                  <legend z-field-legend zVariant="label">Theme Tokens</legend>
                  <p z-field-description>Copy the CSS variables for this preset.</p>
                  <div class="ring-border w-full min-w-0 overflow-hidden rounded-xl ring-1">
                    <div class="flex items-center gap-2 py-1 pr-1.5 pl-3">
                      <div class="text-muted-foreground min-w-0 truncate font-mono text-sm">styles.css</div>
                      <ng-container
                        *ngTemplateOutlet="copyIcon; context: { what: 'theme', text: themeCss(), label: 'Copy theme' }"
                      />
                    </div>
                    <div
                      class="bg-popover no-scrollbar max-h-[45svh] overflow-auto border-t p-3"
                      tabindex="0"
                      role="region"
                      aria-label="styles.css"
                    >
                      <pre
                        class="min-w-max font-mono leading-normal whitespace-pre"
                      ><code data-testid="theme-css">{{ themeCss() }}</code></pre>
                    </div>
                  </div>
                </fieldset>
              </div>
              <z-dialog-footer class="m-0 min-w-0 p-6 sm:flex-col">
                <button type="button" z-button class="h-9 w-full" (click)="copy('theme', themeCss())">
                  {{ copied() === 'theme' ? 'Copied' : 'Copy Theme' }}
                </button>
              </z-dialog-footer>
            </div>
          }
        }
      </div>
    </z-dialog>

    <ng-template #commandFooter let-command="command">
      <z-dialog-footer class="m-0 min-w-0 p-6 sm:flex-col">
        <div class="flex w-full min-w-0 flex-col gap-3">
          <div class="ring-border min-w-0 overflow-hidden rounded-xl ring-1">
            <div class="flex items-center gap-2 py-1 pr-1.5 pl-1">
              <div class="flex gap-0.5 font-mono" role="tablist" aria-label="Package manager">
                @for (manager of managers; track manager) {
                  <button
                    type="button"
                    role="tab"
                    class="text-muted-foreground hover:text-foreground aria-selected:bg-muted aria-selected:text-foreground aria-selected:ring-border focus-visible:ring-ring/50 rounded-md px-2 py-1 text-sm leading-none outline-none focus-visible:ring-2 aria-selected:ring-1"
                    [attr.aria-selected]="packageManager() === manager"
                    [attr.data-manager]="manager"
                    (click)="setManager(manager)"
                  >
                    {{ manager }}
                  </button>
                }
              </div>
              <ng-container
                *ngTemplateOutlet="copyIcon; context: { what: 'command', text: command, label: 'Copy command' }"
              />
            </div>
            <div class="bg-popover border-t p-3">
              <div class="no-scrollbar overflow-x-auto" tabindex="0" role="region" aria-label="Command">
                <code class="font-mono text-sm whitespace-nowrap" data-testid="command">{{ command }}</code>
              </div>
            </div>
          </div>
          <button type="button" z-button class="h-9 w-full" (click)="copy('command', command)">
            {{ copied() === 'command' ? 'Copied' : 'Copy Command' }}
          </button>
        </div>
      </z-dialog-footer>
    </ng-template>

    <ng-template #copyIcon let-what="what" let-text="text" let-label="label">
      <button type="button" z-button zType="ghost" zSize="icon-sm" class="ml-auto" (click)="copy(what, text)">
        <ng-icon [name]="copied() === what ? 'lucideCheck' : 'lucideCopy'" class="size-4!" />
        <span class="sr-only">{{ label }}</span>
      </button>
    </ng-template>

    <ng-template #logo let-name="name">
      @switch (name) {
        @case ('angular') {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
            stroke-linecap="round"
            class="size-4"
          >
            <path d="M12 2.5 3.5 5.5l1.3 11.2L12 21.5l7.2-4.8 1.3-11.2z" />
            <path d="m8.6 16 3.4-8 3.4 8M9.8 13.2h4.4" />
          </svg>
        }
        @case ('nx') {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            class="size-4"
          >
            <path d="M4.5 20V4l15 16V4" />
          </svg>
        }
        @case ('analog') {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            class="size-4"
          >
            <path d="M3.5 20.5C5 9 8 3.5 12 3.5s7 5.5 8.5 17" />
            <path d="m8.5 20.5 3.5-8.5 3.5 8.5" />
          </svg>
        }
      }
    </ng-template>
  `,
})
export class CreateGetCodeComponent {
  protected readonly shell = inject(CreateShellService);
  private readonly state = inject(CreateStateService);
  private readonly document = inject(DOCUMENT);

  protected readonly tabs = TABS;
  protected readonly templates = TEMPLATES;
  protected readonly scopes = SCOPES;
  protected readonly managers = PACKAGE_MANAGERS;

  protected readonly tab = signal<GetCodeTab>('new-project');
  protected readonly template = signal<CreateTemplate>('angular');
  protected readonly pointer = signal(false);
  protected readonly rtl = signal(false);
  protected readonly scope = signal<ApplyScope>('full');
  protected readonly packageManager = signal<PackageManager>(DEFAULT_PACKAGE_MANAGER);
  protected readonly copied = signal<CopyTarget | null>(null);

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

  protected async copy(what: CopyTarget, text: string): Promise<void> {
    if (!(await copyText(this.document, text))) return;

    this.copied.set(what);
    if (this.copiedTimer) clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(null), COPIED_MS);
  }
}
