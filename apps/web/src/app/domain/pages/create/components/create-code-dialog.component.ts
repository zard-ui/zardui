import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideDownload, lucideGlobe, lucideX } from '@ng-icons/lucide';

import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

import { CreateBuilderService } from '../services/create-builder.service';

type Tab = 'new' | 'existing' | 'theme';
type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';
/** Os mesmos nomes que `zard-cli apply --only` aceita. */
type ApplyScope = 'full' | 'theme' | 'icons';

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
 *
 * O dialog é escuro, como o painel: ele é a mesma ferramenta, e herdaria o tema
 * do preview se não fosse.
 */
@Component({
  selector: 'z-create-code-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ZardSwitchComponent],
  viewProviders: [provideIcons({ lucideCheck, lucideCopy, lucideDownload, lucideGlobe, lucideX })],
  host: {
    class: 'fixed inset-0 z-100 grid place-items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16',
    '(click)': 'onBackdrop($event)',
    '(document:keydown.escape)': 'closed.emit()',
  },
  template: `
    <div
      class="dark bg-card text-card-foreground flex max-h-[calc(100svh-6rem)] w-full max-w-lg flex-col overflow-hidden rounded-[18px] shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Use this preset"
      (click)="$event.stopPropagation()"
    >
      <header class="relative flex items-center border-b px-7 py-5">
        <div class="flex gap-2" role="tablist">
          @for (option of tabs; track option.id) {
            <button
              type="button"
              role="tab"
              class="hover:bg-muted rounded-lg px-2.5 py-1 text-sm font-medium transition-colors"
              [class]="tab() === option.id ? 'bg-muted text-foreground' : 'text-muted-foreground'"
              [attr.aria-selected]="tab() === option.id"
              (click)="tab.set(option.id)"
            >
              {{ option.label }}
            </button>
          }
        </div>

        <button
          type="button"
          class="text-muted-foreground hover:text-foreground absolute top-4.5 right-5 grid size-7 place-items-center rounded-md transition-colors"
          aria-label="Close"
          (click)="closed.emit()"
        >
          <ng-icon name="lucideX" class="size-4" />
        </button>
      </header>

      <div class="no-scrollbar flex min-h-0 flex-col overflow-y-auto">
        @switch (tab()) {
          @case ('new') {
            <div class="flex flex-col gap-5 px-7 py-5">
              <section class="flex flex-col gap-3">
                <h3 class="text-sm font-medium">Template</h3>
                <div class="grid grid-cols-2 gap-3">
                  @for (option of templates; track option.id) {
                    <button
                      type="button"
                      class="ring-border hover:bg-muted flex h-14 items-center gap-2.5 rounded-[10px] px-4 text-left text-sm ring-1 transition-colors"
                      [class]="template() === option.id ? 'bg-muted ring-foreground/25!' : ''"
                      [attr.aria-pressed]="template() === option.id"
                      (click)="template.set(option.id)"
                    >
                      <img [src]="option.icon" alt="" aria-hidden="true" class="size-4 shrink-0 dark:invert" />
                      <span class="truncate">{{ option.label }}</span>
                    </button>
                  }
                </div>
              </section>

              <div class="bg-border -mx-7 h-px" role="separator"></div>

              <div class="flex items-center justify-between gap-3 text-sm">
                <label class="flex items-center gap-2 font-medium" for="dialog-rtl">
                  <ng-icon name="lucideGlobe" class="size-4" />
                  Enable RTL support
                </label>
                <z-switch
                  zId="dialog-rtl"
                  [zChecked]="builder.preset().rtl"
                  (zCheckedChange)="builder.select('rtl', $event ? 'on' : 'off')"
                />
              </div>
            </div>
          }

          @case ('existing') {
            <div class="flex flex-col gap-3 px-7 py-5">
              <h3 class="text-sm font-medium">Apply Preset</h3>
              <p class="text-muted-foreground text-sm">Pick which parts of the preset to apply.</p>

              <div class="flex flex-col gap-2" role="radiogroup" aria-label="Apply">
                @for (option of scopes; track option.id) {
                  <button
                    type="button"
                    role="radio"
                    class="ring-border hover:bg-muted flex items-start gap-3 rounded-lg p-3 text-left ring-1 transition-colors"
                    [class]="scope() === option.id ? 'bg-muted' : ''"
                    [attr.aria-checked]="scope() === option.id"
                    (click)="scope.set(option.id)"
                  >
                    <span
                      class="ring-foreground/40 mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ring-1"
                      aria-hidden="true"
                    >
                      @if (scope() === option.id) {
                        <span class="bg-foreground size-2 rounded-full"></span>
                      }
                    </span>
                    <span class="flex flex-col gap-1">
                      <span class="text-sm font-medium">{{ option.label }}</span>
                      <span class="text-muted-foreground text-sm">{{ option.detail }}</span>
                    </span>
                  </button>
                }
              </div>
            </div>
          }

          @case ('theme') {
            <div class="flex min-w-0 flex-col gap-3 px-7 py-5">
              <h3 class="text-sm font-medium">Theme Tokens</h3>
              <p class="text-muted-foreground text-sm">Copy the CSS variables for this preset.</p>

              <div class="ring-border w-full min-w-0 overflow-hidden rounded-xl ring-1">
                <div class="flex items-center gap-2 py-1 pr-1.5 pl-3">
                  <span class="text-muted-foreground min-w-0 truncate font-mono text-sm">styles.css</span>
                  <button
                    type="button"
                    class="hover:bg-muted ml-auto grid size-7 place-items-center rounded-md"
                    aria-label="Copy theme"
                    (click)="copy()"
                  >
                    <ng-icon [name]="copied() ? 'lucideCheck' : 'lucideCopy'" class="size-4" />
                  </button>
                </div>
                <div class="bg-popover no-scrollbar max-h-[45svh] overflow-auto border-t p-3">
                  <pre
                    class="min-w-max font-mono text-xs leading-normal whitespace-pre"
                    tabindex="0"
                    aria-label="Theme tokens"
                  ><code>{{ builder.themeCss() }}</code></pre>
                </div>
              </div>
            </div>
          }
        }

        <footer class="flex flex-col gap-3 p-7">
          @if (tab() !== 'theme') {
            <div class="ring-border min-w-0 overflow-hidden rounded-xl ring-1">
              <div class="flex items-center gap-2 py-1 pr-1.5 pl-1">
                <div class="flex font-mono text-sm">
                  @for (manager of packageManagers; track manager) {
                    <button
                      type="button"
                      class="rounded-md px-2 py-1 leading-none transition-colors"
                      [class]="packageManager() === manager ? 'bg-muted text-foreground' : 'text-muted-foreground'"
                      [attr.aria-pressed]="packageManager() === manager"
                      (click)="packageManager.set(manager)"
                    >
                      {{ manager }}
                    </button>
                  }
                </div>
                <button
                  type="button"
                  class="hover:bg-muted ml-auto grid size-7 place-items-center rounded-md"
                  aria-label="Copy command"
                  (click)="copy()"
                >
                  <ng-icon [name]="copied() ? 'lucideCheck' : 'lucideCopy'" class="size-4" />
                </button>
              </div>
              <div class="bg-popover no-scrollbar overflow-x-auto border-t p-3">
                <code class="font-mono text-sm whitespace-nowrap">{{ command() }}</code>
              </div>
            </div>
          }

          <button
            type="button"
            class="bg-primary text-primary-foreground h-9 w-full rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            (click)="copy()"
          >
            {{ copyLabel() }}
          </button>

          <!-- Cor editada à mão não cabe num código curto, então o comando muda
               para apontar um arquivo — e o arquivo precisa existir. -->
          @if (builder.hasOverrides()) {
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground flex h-8 w-full items-center justify-center gap-2 rounded-md text-xs transition-colors"
              (click)="downloadPresetFile()"
            >
              <ng-icon name="lucideDownload" class="size-3" />
              Download zard.preset.json
            </button>
          }
        </footer>
      </div>
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
    { id: 'icons', label: 'Icons only', detail: 'Only the icon library. Colours and radius stay as they are.' },
  ];

  readonly packageManagers: readonly PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

  readonly tab = signal<Tab>('new');
  readonly template = signal('angular');
  readonly scope = signal<ApplyScope>('full');
  readonly packageManager = signal<PackageManager>('pnpm');
  readonly copied = signal(false);

  readonly copyLabel = computed(() => {
    if (this.copied()) return 'Copied';
    return this.tab() === 'theme' ? 'Copy Theme' : 'Copy Command';
  });

  /**
   * O comando exatamente como a CLI o aceita.
   *
   * Copiar e colar tem que funcionar — é a única promessa que esta página faz.
   */
  readonly command = computed(() => {
    const runner = RUNNERS[this.packageManager()];
    const preset = this.builder.hasOverrides() ? './zard.preset.json' : this.builder.code();

    if (this.tab() === 'existing') {
      const only = this.scope() === 'full' ? '' : ` --only ${this.scope()}`;
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
