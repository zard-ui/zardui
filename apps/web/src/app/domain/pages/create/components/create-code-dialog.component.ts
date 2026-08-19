import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideDownload, lucideX } from '@ng-icons/lucide';

import { CreateBuilderService } from '../services/create-builder.service';

type Tab = 'new' | 'existing' | 'theme';
type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';
type ApplyScope = 'full' | 'theme';

interface TemplateOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

/**
 * O que a página devolve: o comando pronto para colar.
 *
 * Cada aba responde a uma situação diferente — projeto novo, projeto que já
 * existe, e "só me dê o CSS". Não há aba de fontes: typeset está fora do escopo
 * desta feature, e oferecer aqui uma opção que a CLI não aceita seria pior do
 * que não oferecer nada.
 */
@Component({
  selector: 'z-create-code-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideCheck, lucideCopy, lucideDownload, lucideX })],
  host: {
    class: 'fixed inset-0 z-100 grid place-items-center bg-black/50 p-4',
    '(click)': 'onBackdrop($event)',
    '(document:keydown.escape)': 'closed.emit()',
  },
  template: `
    <div
      class="bg-background flex max-h-[85vh] w-full max-w-[450px] flex-col overflow-hidden rounded-[14px] border shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Use this preset"
      (click)="$event.stopPropagation()"
    >
      <header class="flex items-center justify-between gap-2 border-b p-4">
        <div class="bg-muted flex rounded-lg p-0.5 text-xs font-medium">
          @for (option of tabs; track option.id) {
            <button
              type="button"
              class="rounded-md px-3 py-1.5 transition-colors"
              [class]="tab() === option.id ? 'bg-background text-foreground shadow-sm' : 'text-foreground/70'"
              [attr.aria-pressed]="tab() === option.id"
              (click)="tab.set(option.id)"
            >
              {{ option.label }}
            </button>
          }
        </div>

        <button
          type="button"
          class="text-muted-foreground hover:text-foreground grid size-7 shrink-0 place-items-center rounded-md transition-colors"
          aria-label="Close"
          (click)="closed.emit()"
        >
          <ng-icon name="lucideX" size="14" />
        </button>
      </header>

      <div class="flex flex-col gap-4 overflow-y-auto p-4">
        @switch (tab()) {
          @case ('new') {
            <section class="flex flex-col gap-2">
              <h3 class="text-sm font-medium">Template</h3>
              <div class="grid grid-cols-2 gap-2">
                @for (option of templates; track option.id) {
                  <button
                    type="button"
                    class="flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors"
                    [class]="template() === option.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'"
                    [attr.aria-pressed]="template() === option.id"
                    (click)="template.set(option.id)"
                  >
                    <img [src]="option.icon" [alt]="''" class="size-5 shrink-0" aria-hidden="true" />
                    <span class="truncate">{{ option.label }}</span>
                  </button>
                }
              </div>
            </section>

            <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 text-sm">
              <span class="flex flex-col">
                <span class="font-medium">Enable RTL support</span>
                <span class="text-muted-foreground text-xs">Records the direction in components.json.</span>
              </span>
              <input
                type="checkbox"
                class="size-4 shrink-0"
                [checked]="builder.preset().rtl"
                (change)="builder.select('rtl', $any($event.target).checked ? 'on' : 'off')"
              />
            </label>
          }

          @case ('existing') {
            <section class="flex flex-col gap-1">
              <h3 class="text-sm font-medium">Apply Preset</h3>
              <p class="text-muted-foreground text-xs">Pick which parts of the preset to apply.</p>
            </section>

            <div class="flex flex-col gap-2">
              @for (option of scopes; track option.id) {
                <button
                  type="button"
                  class="flex flex-col gap-0.5 rounded-lg border p-3 text-left transition-colors"
                  [class]="scope() === option.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'"
                  [attr.aria-pressed]="scope() === option.id"
                  (click)="scope.set(option.id)"
                >
                  <span class="text-sm font-medium">{{ option.label }}</span>
                  <span class="text-muted-foreground text-xs">{{ option.detail }}</span>
                </button>
              }
            </div>
          }

          @case ('theme') {
            <section class="flex flex-col gap-1">
              <h3 class="text-sm font-medium">Theme Tokens</h3>
              <p class="text-muted-foreground text-xs">Copy the CSS variables for this preset.</p>
            </section>

            <div class="overflow-hidden rounded-lg border">
              <div class="bg-muted text-muted-foreground border-b px-3 py-1.5 font-mono text-xs">styles.css</div>
              <pre
                class="max-h-[280px] overflow-auto p-3 font-mono text-[11px] leading-relaxed"
                tabindex="0"
                aria-label="Theme tokens"
              ><code>{{ builder.themeCss() }}</code></pre>
            </div>
          }
        }

        @if (tab() !== 'theme') {
          <section class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="bg-muted flex rounded-md p-0.5 text-[11px] font-medium">
                @for (manager of packageManagers; track manager) {
                  <button
                    type="button"
                    class="rounded px-2 py-1 transition-colors"
                    [class]="
                      packageManager() === manager ? 'bg-background text-foreground shadow-sm' : 'text-foreground/70'
                    "
                    [attr.aria-pressed]="packageManager() === manager"
                    (click)="packageManager.set(manager)"
                  >
                    {{ manager }}
                  </button>
                }
              </div>
            </div>

            <pre
              class="bg-muted overflow-x-auto rounded-lg p-3 font-mono text-[11px]"
              tabindex="0"
              aria-label="Command"
            ><code>{{ command() }}</code></pre>
          </section>
        }
      </div>

      <footer class="flex flex-col gap-2 border-t p-4">
        <button
          type="button"
          class="bg-primary text-primary-foreground flex h-9 w-full items-center justify-center gap-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
          (click)="copy()"
        >
          <ng-icon [name]="copied() ? 'lucideCheck' : 'lucideCopy'" size="14" />
          {{ tab() === 'theme' ? 'Copy Theme' : 'Copy Command' }}
        </button>

        <!-- Cor editada à mão não cabe num código curto, então o comando muda
             para apontar um arquivo — e o arquivo precisa existir. -->
        @if (builder.hasOverrides()) {
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground flex h-8 w-full items-center justify-center gap-2 rounded-md text-xs transition-colors"
            (click)="downloadPresetFile()"
          >
            <ng-icon name="lucideDownload" size="12" />
            Download zard.preset.json
          </button>
        }
      </footer>
    </div>
  `,
})
export class CreateCodeDialogComponent {
  readonly builder = inject(CreateBuilderService);
  readonly closed = output<void>();

  readonly tabs = [
    { id: 'new' as const, label: 'New Project' },
    { id: 'existing' as const, label: 'Existing Project' },
    { id: 'theme' as const, label: 'Theme' },
  ];

  readonly templates: readonly TemplateOption[] = [
    { id: 'angular', label: 'Angular', icon: '/images/envs/angular.svg' },
    { id: 'angular-library', label: 'Angular Library', icon: '/images/envs/angular.svg' },
    { id: 'nx', label: 'Nx', icon: '/images/envs/nx.svg' },
    { id: 'nx-library', label: 'Nx Library', icon: '/images/envs/nx.svg' },
    { id: 'analog', label: 'Analog.js', icon: '/images/envs/analog.svg' },
  ];

  readonly scopes: ReadonlyArray<{ id: ApplyScope; label: string; detail: string }> = [
    { id: 'full', label: 'Full preset', detail: 'Theme tokens, icon library and components.json.' },
    { id: 'theme', label: 'Theme only', detail: 'Just the tokens. Your components stay as they are.' },
  ];

  readonly packageManagers: readonly PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

  readonly tab = signal<Tab>('new');
  readonly template = signal('angular');
  readonly scope = signal<ApplyScope>('full');
  readonly packageManager = signal<PackageManager>('pnpm');
  readonly copied = signal(false);

  /**
   * O comando exatamente como a CLI o aceita.
   *
   * Copiar e colar tem que funcionar — é a única promessa que esta página faz.
   */
  readonly command = computed(() => {
    const runner = RUNNERS[this.packageManager()];
    const preset = this.builder.hasOverrides() ? './zard.preset.json' : this.builder.code();

    if (this.tab() === 'existing') {
      const only = this.scope() === 'theme' ? ' --only theme' : '';
      return `${runner} zard-cli@latest apply ${preset}${only}`;
    }

    return `${runner} zard-cli@latest create my-app --template ${this.template()} --preset ${preset}`;
  });

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.tab() === 'theme' ? this.builder.themeCss() : this.command());

    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  downloadPresetFile(): void {
    const blob = new Blob([this.builder.presetFile()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'zard.preset.json';
    anchor.click();

    URL.revokeObjectURL(url);
  }
}

/** Como cada gerenciador roda um binário que não está instalado. */
const RUNNERS: Record<PackageManager, string> = {
  pnpm: 'pnpm dlx',
  npm: 'npx',
  yarn: 'yarn dlx',
  bun: 'bunx',
};
