import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay, type ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';

import { ZardDarkMode } from '@zard/services/dark-mode';

import { CreateBuilderService } from '../services/create-builder.service';

interface MenuAction {
  readonly label: string;
  readonly shortcut: string;
  readonly run: () => void;
  readonly disabled?: () => boolean;
}

/**
 * O cabeçalho do painel: a palavra "Menu" e tudo o que não coube num card.
 *
 * As ações daqui são as que não têm valor a escolher — sortear, desfazer,
 * inverter o tema, zerar. Elas apareceriam mal como um décimo primeiro card,
 * porque um card do painel promete "isto é uma propriedade do preset", e nenhuma
 * destas é.
 *
 * Os atalhos escritos ao lado não são enfeite: eles são a única forma de alguém
 * descobrir que `R` sorteia. Quem os escuta é o painel — este menu só os anuncia.
 */
@Component({
  selector: 'z-create-main-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, CdkOverlayOrigin, CdkConnectedOverlay],
  viewProviders: [provideIcons({ lucideMenu })],
  host: {
    class: 'relative block',
    '(document:keydown.escape)': 'close()',
  },
  template: `
    <button
      type="button"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      class="ring-foreground/10 hover:bg-muted flex w-full items-center justify-between gap-2 rounded-lg px-1.75 py-1.5 ring-1 focus-visible:outline-none"
      [class.bg-muted]="open()"
      [attr.aria-expanded]="open()"
      aria-haspopup="menu"
      aria-label="Builder menu"
      (click)="open.set(!open())"
    >
      <span class="text-sm font-medium">Menu</span>
      <ng-icon name="lucideMenu" class="size-5" />
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
      (overlayOutsideClick)="close()"
      (detach)="close()"
    >
      <div
        class="w-60 rounded-xl bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl dark:bg-neutral-800/90 dark:ring-neutral-700/50"
        role="menu"
      >
        @for (group of groups; track $index) {
          @if ($index > 0) {
            <div class="-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700" role="separator"></div>
          }
          @for (action of group; track action.label) {
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium select-none hover:bg-neutral-600 focus-visible:bg-neutral-600 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-700/80"
              [disabled]="action.disabled?.() ?? false"
              (click)="run(action)"
            >
              {{ action.label }}
              <span class="ml-auto text-xs tracking-widest text-neutral-400">{{ action.shortcut }}</span>
            </button>
          }
        }
      </div>
    </ng-template>
  `,
})
export class CreateMainMenuComponent {
  private readonly overlay = inject(Overlay);
  private readonly builder = inject(CreateBuilderService);
  private readonly darkMode = inject(ZardDarkMode);

  readonly openPreset = output<void>();
  readonly open = signal(false);

  readonly positions: ConnectedPosition[] = [
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 26 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
  ];

  readonly scrollStrategy = this.overlay.scrollStrategies.reposition();

  readonly groups: ReadonlyArray<readonly MenuAction[]> = [
    [
      { label: 'Open Preset...', shortcut: 'O', run: () => this.openPreset.emit() },
      { label: 'Shuffle', shortcut: 'R', run: () => this.builder.shuffle() },
      { label: 'Light/Dark', shortcut: 'D', run: () => this.darkMode.toggleTheme() },
    ],
    [
      { label: 'Undo', shortcut: 'Ctrl+Z', run: () => this.builder.undo(), disabled: () => !this.builder.canUndo() },
      {
        label: 'Redo',
        shortcut: 'Ctrl+Shift+Z',
        run: () => this.builder.redo(),
        disabled: () => !this.builder.canRedo(),
      },
    ],
    [{ label: 'Reset', shortcut: 'Shift+R', run: () => this.builder.reset() }],
  ];

  run(action: MenuAction): void {
    action.run();
    this.close();
  }

  close(): void {
    this.open.set(false);
  }
}
