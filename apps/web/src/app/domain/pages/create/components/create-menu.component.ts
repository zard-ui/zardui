import { ChangeDetectionStrategy, Component, computed, inject, output, signal, viewChildren } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy } from '@ng-icons/lucide';

import { ZardDarkMode } from '@zard/services/dark-mode';

import { CreateMainMenuComponent } from './create-main-menu.component';
import { CreatePickerComponent } from './create-picker.component';
import { CreateBuilderService, type Control, type ControlId } from '../services/create-builder.service';

/**
 * O painel de controles — o *chrome* da ferramenta, não parte da amostra.
 *
 * Ele é sempre escuro, mesmo com o site e o preview em claro: a classe `dark` no
 * container troca os tokens só aqui dentro. Não é preferência estética — se o
 * painel herdasse o tema da página, um preview claro o deixaria branco sobre
 * branco, e ele deixaria de se ler como "os controles" para virar mais um pedaço
 * do que está sendo desenhado.
 *
 * Os controles vêm em grupos separados por linha, e a ordem não é alfabética: é
 * a ordem em que as decisões dependem umas das outras. Cor da base primeiro,
 * porque o destaque é derivado dela; depois a forma (ícones, raio); e por último
 * o que é modo, não aparência.
 *
 * Abaixo de `md` a coluna vira uma faixa que rola na horizontal — 200px de
 * controles empilhados sobre 390px de tela não deixariam preview nenhum, e o
 * preview é a razão da página existir.
 */
@Component({
  selector: 'z-create-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, CreatePickerComponent, CreateMainMenuComponent],
  viewProviders: [provideIcons({ lucideCheck, lucideCopy })],
  host: {
    class: 'contents',
    '(document:keydown)': 'onKeydown($event)',
  },
  template: `
    <div
      class="dark bg-card/90 text-card-foreground ring-foreground/10 isolate z-10 flex max-h-full w-full min-w-0 shrink-0 flex-col gap-3.5 self-start rounded-[18px] py-3.5 shadow-xl ring-1 backdrop-blur-xl md:min-h-0 md:w-(--customizer-width)"
    >
      <header class="hidden border-b px-3.5 pb-3.5 md:block">
        <z-create-main-menu (openPreset)="openPreset.set(!openPreset())" />
      </header>

      <div
        class="no-scrollbar min-h-0 shrink overflow-x-auto overflow-y-hidden px-3.5 md:overflow-x-hidden md:overflow-y-auto"
      >
        <div class="flex flex-row gap-2.5 md:flex-col md:gap-3">
          @for (group of groups(); track $index) {
            @if ($index > 0) {
              <div class="bg-border -mx-3.5 hidden h-px md:block" role="separator"></div>
            }
            @for (control of group; track control.id) {
              <z-create-picker
                [control]="control"
                [locked]="builder.isLocked(control.id)"
                (selected)="onSelect($event)"
                (lockToggled)="builder.toggleLock($event)"
              />
            }
          }
        </div>
      </div>

      <footer class="flex min-w-0 gap-2 px-3.5 md:flex-col md:gap-3 md:border-t md:pt-3.5">
        <button
          type="button"
          class="ring-foreground/10 hover:bg-muted flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[10px] px-2 font-mono text-xs font-medium ring-1 md:flex-none"
          [attr.aria-label]="builder.code() ? 'Copy the preset code' : 'No short code for custom colours'"
          [disabled]="!builder.code()"
          (click)="copyCode()"
        >
          <span class="truncate">{{ builder.code() ? '--preset ' + builder.code() : 'custom colours' }}</span>
          <ng-icon [name]="copied() ? 'lucideCheck' : 'lucideCopy'" class="size-3 shrink-0" />
        </button>

        <button
          type="button"
          class="ring-foreground/10 hover:bg-muted h-9 max-w-20 min-w-0 flex-1 rounded-[10px] px-2 text-sm font-medium ring-1 sm:max-w-none md:flex-none"
          [attr.aria-expanded]="openPreset()"
          (click)="openPreset.set(!openPreset())"
        >
          <span class="md:hidden">Open</span>
          <span class="hidden md:inline">Open Preset</span>
        </button>

        <button
          type="button"
          class="ring-foreground/10 hover:bg-muted h-9 max-w-20 min-w-0 flex-1 rounded-[10px] px-2 text-sm font-medium ring-1 sm:max-w-none md:flex-none"
          (click)="builder.shuffle()"
        >
          Shuffle
        </button>
      </footer>

      @if (openPreset()) {
        <div class="px-3.5">
          <form class="flex gap-1.5" (submit)="loadCode($event)">
            <input
              name="code"
              placeholder="a000301e"
              aria-label="Preset code"
              class="ring-foreground/10 placeholder:text-muted-foreground focus-visible:ring-foreground/40 h-9 w-full min-w-0 rounded-[10px] bg-transparent px-2 font-mono text-xs ring-1 focus-visible:outline-none"
              [value]="pendingCode()"
              (input)="pendingCode.set($any($event.target).value)"
            />
            <button
              type="submit"
              class="bg-muted hover:bg-muted/80 h-9 shrink-0 rounded-[10px] px-2.5 text-xs font-medium"
            >
              Load
            </button>
          </form>

          @if (loadError()) {
            <p class="text-destructive pt-1.5 text-xs">{{ loadError() }}</p>
          }
        </div>
      }

      <footer class="border-t px-3.5 pt-3.5">
        <button
          type="button"
          class="bg-primary text-primary-foreground h-9 w-full rounded-[10px] text-sm font-medium hover:opacity-90"
          (click)="getCode.emit()"
        >
          Get Code
        </button>
      </footer>
    </div>
  `,
})
export class CreateMenuComponent {
  readonly builder = inject(CreateBuilderService);
  private readonly darkMode = inject(ZardDarkMode);

  readonly openPreset = signal(false);
  readonly getCode = output<void>();
  readonly pendingCode = signal('');
  readonly loadError = signal<string | null>(null);
  readonly copied = signal(false);

  private readonly pickers = viewChildren(CreatePickerComponent);

  /**
   * Os controles em grupos, na ordem em que uma decisão depende da anterior.
   *
   * O agrupamento é montado aqui e não no serviço porque ele é uma decisão de
   * leitura do painel: a CLI e o código do preset não têm grupo nenhum, têm
   * campos.
   */
  private static readonly GROUPS: ReadonlyArray<readonly ControlId[]> = [
    ['baseColor', 'theme', 'chart'],
    ['icons', 'radius'],
    ['darkMode', 'rtl'],
  ];

  readonly groups = computed<Control[][]>(() => {
    const byId = new Map(this.builder.controls().map(control => [control.id, control]));

    return CreateMenuComponent.GROUPS.map(group =>
      group.map(id => byId.get(id)).filter((control): control is Control => !!control),
    );
  });

  /**
   * Os atalhos que o menu anuncia.
   *
   * Ficam aqui, e não na página, porque é este componente que sabe o que cada um
   * faz — e ele está montado sempre que a página está. Teclas soltas (`r`, `d`)
   * só valem fora de um campo: senão digitar "radius" numa caixa de texto
   * sortearia o preset quatro vezes.
   */
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const typing = !!target?.closest('input, textarea, [contenteditable="true"]');

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) this.builder.redo();
      else this.builder.undo();
      return;
    }

    if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === 'R') {
      event.preventDefault();
      this.builder.reset();
      return;
    }

    if (event.key === 'r') {
      event.preventDefault();
      this.builder.shuffle();
      return;
    }

    if (event.key === 'd') {
      event.preventDefault();
      this.darkMode.toggleTheme();
      return;
    }

    if (event.key === 'o') {
      event.preventDefault();
      this.openPreset.set(true);
    }
  }

  /** Fecha as listas dos outros cards — duas abertas ao mesmo tempo se sobrepõem. */
  onSelect(event: { id: ControlId; value: string }): void {
    this.builder.select(event.id, event.value);
    for (const picker of this.pickers()) picker.close();
  }

  async copyCode(): Promise<void> {
    const code = this.builder.code();
    if (!code) return;

    await navigator.clipboard.writeText(code);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  loadCode(event: Event): void {
    event.preventDefault();

    const result = this.builder.applyCode(this.pendingCode().trim());

    if (result.ok) {
      this.loadError.set(null);
      this.openPreset.set(false);
      this.pendingCode.set('');
      return;
    }

    this.loadError.set(result.reason ?? 'That code could not be read.');
  }
}
