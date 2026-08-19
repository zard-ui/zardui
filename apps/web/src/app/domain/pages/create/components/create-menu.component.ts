import { ChangeDetectionStrategy, Component, inject, output, signal, viewChildren } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideCopy, lucideDices, lucideFolderOpen, lucideCheck } from '@ng-icons/lucide';

import { CreateControlCardComponent } from './create-control-card.component';
import { CreateBuilderService, type ControlId } from '../services/create-builder.service';

/**
 * O painel de controles — o *chrome* da ferramenta, não parte da amostra.
 *
 * Ele é sempre escuro, mesmo com o site e o preview em claro. Não é preferência
 * estética: se herdasse os tokens do preset, um tema claro o deixaria branco
 * sobre um canvas branco, e o painel deixaria de se ler como "os controles" para
 * virar mais um pedaço do que está sendo desenhado. Daí as cores literais aqui,
 * fora do sistema de tokens do site.
 */
@Component({
  selector: 'z-create-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, CreateControlCardComponent],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideCopy, lucideDices, lucideFolderOpen, lucideCheck })],
  template: `
    <div
      class="flex w-[224px] flex-col gap-3 rounded-[18px] bg-[oklch(0.205_0_0)]/90 p-3 shadow-2xl ring-1 ring-white/15 backdrop-blur-md"
      [class.h-auto]="collapsed()"
    >
      <header class="flex items-center justify-between px-1">
        <h2 class="text-sm font-semibold text-white">Menu</h2>
        <button
          type="button"
          class="grid size-6 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          [attr.aria-label]="collapsed() ? 'Expand the menu' : 'Collapse the menu'"
          [attr.aria-expanded]="!collapsed()"
          (click)="collapsed.set(!collapsed())"
        >
          <ng-icon name="lucideChevronLeft" size="14" [class.rotate-180]="collapsed()" class="transition-transform" />
        </button>
      </header>

      @if (!collapsed()) {
        <div class="group flex flex-col gap-1 overflow-y-auto">
          @for (control of builder.controls(); track control.id) {
            <z-create-control-card
              [control]="control"
              [locked]="builder.isLocked(control.id)"
              (selected)="onSelect($event)"
              (lockToggled)="builder.toggleLock($event)"
            />
          }
        </div>

        <footer class="flex flex-col gap-2 border-t border-white/10 pt-3">
          <button
            type="button"
            class="flex h-8 items-center justify-between rounded-md px-2 font-mono text-[11px] text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            [attr.aria-label]="'Copy the preset code'"
            (click)="copyCode()"
          >
            <span class="truncate">{{ builder.code() ? '--preset ' + builder.code() : 'custom colours' }}</span>
            <ng-icon [name]="copied() ? 'lucideCheck' : 'lucideCopy'" size="12" class="shrink-0" />
          </button>

          <div class="flex gap-2">
            <button
              type="button"
              class="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium text-white/80 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
              (click)="openPreset.set(!openPreset())"
            >
              <ng-icon name="lucideFolderOpen" size="12" />
              Open
            </button>
            <button
              type="button"
              class="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium text-white/80 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
              (click)="builder.shuffle()"
            >
              <ng-icon name="lucideDices" size="12" />
              Shuffle
            </button>
          </div>

          @if (openPreset()) {
            <form class="flex gap-1.5" (submit)="loadCode($event)">
              <input
                name="code"
                placeholder="a000301e"
                aria-label="Preset code"
                class="h-8 w-full min-w-0 rounded-md bg-white/5 px-2 font-mono text-[11px] text-white ring-1 ring-white/10 placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:outline-none"
                [value]="pendingCode()"
                (input)="pendingCode.set($any($event.target).value)"
              />
              <button
                type="submit"
                class="h-8 shrink-0 rounded-md bg-white/10 px-2 text-[11px] font-medium text-white transition-colors hover:bg-white/20"
              >
                Load
              </button>
            </form>

            @if (loadError()) {
              <p class="px-1 text-[11px] text-red-300">{{ loadError() }}</p>
            }
          }

          <button
            type="button"
            class="h-9 w-full rounded-md bg-white text-sm font-semibold text-black transition-colors hover:bg-white/90"
            (click)="getCode.emit()"
          >
            Get Code
          </button>
        </footer>
      }
    </div>
  `,
})
export class CreateMenuComponent {
  readonly builder = inject(CreateBuilderService);

  readonly collapsed = signal(false);
  readonly openPreset = signal(false);
  readonly getCode = output<void>();
  readonly pendingCode = signal('');
  readonly loadError = signal<string | null>(null);
  readonly copied = signal(false);

  private readonly cards = viewChildren(CreateControlCardComponent);

  /** Fecha os popovers dos outros cards — dois abertos ao mesmo tempo se sobrepõem. */
  onSelect(event: { id: ControlId; value: string }): void {
    this.builder.select(event.id, event.value);
    for (const card of this.cards()) card.close();
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
