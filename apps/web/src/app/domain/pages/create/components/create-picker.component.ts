import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay, type ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideLock,
  lucideLockOpen,
  lucideMoon,
  lucideShapes,
  lucideSun,
  lucideType,
} from '@ng-icons/lucide';

import type { Control, ControlId } from '../services/create-builder.service';

/**
 * Um controle do painel: rótulo em cima, valor embaixo, indicador à direita.
 *
 * O card não tem fundo em repouso — só um anel de 1px. O fundo aparece no hover
 * e enquanto a lista está aberta, e é essa diferença que diz qual dos dez
 * controles está sendo mexido sem precisar de um estado "selecionado".
 *
 * A lista sai por um overlay do CDK, e não por um `absolute` dentro do card. Não
 * é preferência de API: a coluna de controles rola, e um elemento posicionado
 * dentro de um container que rola é recortado por ele — a lista simplesmente não
 * apareceria. O overlay a ancora ao card e a desenha fora de qualquer recorte.
 *
 * Ela usa cores literais em vez de tokens porque é desenhada no `body`, longe do
 * `dark` do painel: herdaria o tema do site e ficaria branca sobre o preview.
 */
@Component({
  selector: 'z-create-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, CdkOverlayOrigin, CdkConnectedOverlay],
  viewProviders: [
    provideIcons({ lucideCheck, lucideLock, lucideLockOpen, lucideMoon, lucideShapes, lucideSun, lucideType }),
  ],
  host: {
    class: 'group/picker relative block shrink-0',
    '(document:keydown.escape)': 'close()',
  },
  template: `
    <button
      type="button"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      class="ring-foreground/10 hover:bg-muted focus-visible:ring-foreground/50 relative w-36 touch-manipulation rounded-xl p-3 text-left ring-1 select-none focus-visible:outline-none md:h-15 md:w-full md:px-3 md:py-2.5"
      [class.bg-muted]="open()"
      [attr.aria-expanded]="open()"
      aria-haspopup="listbox"
      (click)="toggle()"
    >
      <span class="flex flex-col justify-start overflow-hidden">
        <span class="text-muted-foreground text-xs">{{ control().label }}</span>
        <span class="text-foreground truncate text-sm font-semibold md:text-[15px]">{{ control().value }}</span>
      </span>

      <span class="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center md:right-3">
        @if (control().swatch) {
          <span
            class="ring-foreground/20 size-4 rounded-full ring-1"
            [style.background]="control().swatch"
            aria-hidden="true"
          ></span>
        } @else if (control().id === 'radius') {
          <!-- A curva desenhada é o indicador honesto de um raio: um número
               obrigaria a pessoa a imaginar o que ele produz. -->
          <span
            class="border-foreground/70 size-4 border-t-2 border-l-2"
            [style.border-top-left-radius]="radiusPreview()"
            aria-hidden="true"
          ></span>
        } @else {
          <ng-icon [name]="indicatorIcon()" class="text-foreground/75 size-4" aria-hidden="true" />
        }
      </span>
    </button>

    <!-- Aparece no hover do card e fica visível enquanto travado: sem isso não
         haveria como saber o que o Shuffle vai preservar. Fica fora do botão
         porque um controle dentro de outro não é alcançável por teclado. -->
    <button
      type="button"
      class="ring-foreground/60 absolute top-1/2 right-8 grid size-4 -translate-y-1/2 place-items-center rounded opacity-0 transition-opacity group-focus-within/picker:opacity-100 group-hover/picker:opacity-100 focus:opacity-100 focus-visible:ring-1 focus-visible:outline-none md:right-8.5"
      [class.opacity-100]="locked()"
      [attr.aria-pressed]="locked()"
      [attr.aria-label]="(locked() ? 'Unlock ' : 'Lock ') + control().label"
      (click)="lockToggled.emit(control().id)"
    >
      <ng-icon [name]="locked() ? 'lucideLock' : 'lucideLockOpen'" class="text-foreground size-4" />
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
        class="no-scrollbar max-h-[min(320px,60svh)] w-60 overflow-y-auto rounded-xl bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl dark:bg-neutral-800/90 dark:ring-neutral-700/50"
        role="listbox"
        [attr.aria-label]="control().label"
      >
        @for (option of control().options; track option.id) {
          <button
            type="button"
            role="option"
            [attr.aria-selected]="option.label === control().value"
            class="relative flex w-full items-center rounded-lg py-2 pr-8 pl-2.5 text-sm font-medium text-neutral-100 select-none hover:bg-neutral-600 focus-visible:bg-neutral-600 focus-visible:outline-none dark:hover:bg-neutral-700/80 dark:focus-visible:bg-neutral-700/80"
            (click)="choose(option.id)"
          >
            <span class="truncate">{{ option.label }}</span>
            @if (option.label === control().value) {
              <ng-icon name="lucideCheck" class="absolute right-2 size-4 shrink-0" />
            }
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class CreatePickerComponent {
  private readonly overlay = inject(Overlay);

  readonly control = input.required<Control>();
  readonly locked = input(false);

  readonly selected = output<{ id: ControlId; value: string }>();
  readonly lockToggled = output<ControlId>();

  private readonly _open = signal(false);
  readonly open = this._open.asReadonly();

  /**
   * À direita do card em tela grande; por cima dele no celular.
   *
   * No celular a coluna vira uma faixa horizontal colada no rodapé, e não há
   * 208px à direita para a lista ocupar — o CDK cai na segunda posição sozinho
   * quando a primeira não cabe na janela.
   */
  readonly positions: ConnectedPosition[] = [
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 26 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
  ];

  readonly scrollStrategy = this.overlay.scrollStrategies.reposition();

  /** O raio como a curva do indicador o mostra, num quadrado de 16px. */
  readonly radiusPreview = computed(() => {
    const previews: Record<string, string> = {
      none: '0px',
      small: '3px',
      medium: '5px',
      default: '6px',
      large: '9px',
    };

    return previews[this.control().value.toLowerCase()] ?? '6px';
  });

  /** O glifo do indicador para os controles que não têm cor nem curva. */
  readonly indicatorIcon = computed(() => {
    const control = this.control();

    if (control.id === 'icons') return 'lucideShapes';
    if (control.id === 'rtl') return 'lucideType';

    return control.value === 'Off' ? 'lucideSun' : 'lucideMoon';
  });

  toggle(): void {
    this._open.update(open => !open);
  }

  close(): void {
    this._open.set(false);
  }

  choose(value: string): void {
    this.selected.emit({ id: this.control().id, value });
    this._open.set(false);
  }
}
