import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardPopoverImports } from '@zard/components/popover/popover.imports';

import { CreateGlyphComponent } from './create-glyph.component';
import { isApplePlatform } from '../lib/create-shortcuts';
import type { CreateAction } from '../lib/create.protocol';
import { CreateStateService } from '../services/create-state.service';

interface MenuEntry {
  readonly action: CreateAction;
  readonly label: string;
  readonly shortcut: string;
  readonly disabled?: boolean;
}

/**
 * The "Menu" at the top of the customizer: Navigate, Open Preset, Shuffle, Light/Dark, then Undo, Redo and Reset,
 * each with its shortcut (⌘ on Apple platforms, Ctrl elsewhere).
 */
@Component({
  selector: 'z-create-menu',
  imports: [CreateGlyphComponent, ...ZardPopoverImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <button
      type="button"
      class="ring-foreground/10 hover:bg-muted aria-expanded:bg-muted focus-visible:ring-foreground/50 flex w-full items-center justify-between gap-2 rounded-lg px-1.75 py-2 text-left text-sm font-medium ring-1 select-none focus-visible:outline-none"
      zPopover
      zAlign="start"
      zPlacement="right"
      [zAlignOffset]="-8"
      [zSideOffset]="20"
      [zContent]="entries"
      [zVisible]="open()"
      (zVisibleChange)="open.set($event)"
    >
      <span>Menu</span>
      <z-create-glyph kind="menu" />
    </button>

    <ng-template #entries>
      <z-popover
        class="dark w-52 gap-0 rounded-xl border-0 bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl dark:bg-neutral-800/90 dark:ring-neutral-700/50"
        aria-label="Menu"
      >
        <div role="menu" aria-label="Menu" (keydown)="onKeydown($event)">
          @for (group of groups(); track $index) {
            <div role="group">
              @for (entry of group; track entry.action) {
                <button
                  type="button"
                  role="menuitem"
                  class="relative flex w-full cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium text-neutral-100 outline-hidden select-none hover:bg-neutral-600 focus:bg-neutral-600 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-700/80 dark:focus:bg-neutral-700/80"
                  [attr.data-action]="entry.action"
                  [disabled]="entry.disabled"
                  (click)="run(entry.action)"
                >
                  {{ entry.label }}
                  <span class="ml-auto text-xs tracking-widest text-neutral-400">{{ entry.shortcut }}</span>
                </button>
              }
            </div>
            @if (!$last) {
              <div role="separator" class="-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700"></div>
            }
          }
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class CreateMenuComponent {
  private readonly document = inject(DOCUMENT);
  private readonly state = inject(CreateStateService);

  protected readonly open = signal(false);
  private readonly apple = signal(false);

  constructor() {
    afterNextRender(() => {
      const nav = this.document.defaultView?.navigator;
      this.apple.set(isApplePlatform(nav?.platform || nav?.userAgent || ''));
    });
  }

  protected readonly groups = () => {
    const apple = this.apple();
    const mod = apple ? '⌘' : 'Ctrl+';

    const groups: MenuEntry[][] = [
      [
        { action: 'navigate', label: 'Navigate...', shortcut: `${mod}P` },
        { action: 'open-preset', label: 'Open Preset...', shortcut: 'O' },
        { action: 'shuffle', label: 'Shuffle', shortcut: 'R' },
        { action: 'toggle-dark', label: 'Light/Dark', shortcut: 'D' },
      ],
      [
        { action: 'undo', label: 'Undo', shortcut: `${mod}Z`, disabled: !this.state.canUndo() },
        { action: 'redo', label: 'Redo', shortcut: apple ? '⇧⌘Z' : 'Ctrl+Shift+Z', disabled: !this.state.canRedo() },
      ],
      [{ action: 'reset', label: 'Reset', shortcut: '⇧R' }],
    ];
    return groups;
  };

  protected run(action: CreateAction): void {
    this.open.set(false);
    this.state.run(action);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();

    const items = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'),
    );
    const current = items.indexOf(this.document.activeElement as HTMLElement);
    items[(current + step + items.length) % items.length]?.focus();
  }
}
