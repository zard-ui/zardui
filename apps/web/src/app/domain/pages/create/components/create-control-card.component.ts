import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideLock,
  lucideLockOpen,
  lucideMoon,
  lucideShapes,
  lucideSun,
  lucideTextCursor,
} from '@ng-icons/lucide';

import type { Control, ControlId } from '../services/create-builder.service';

/**
 * Um controle do painel: rótulo em cima, valor embaixo, indicador à direita.
 *
 * As medidas (200 × 52, raio 10) são as da referência, e não são decoração: o
 * painel inteiro é dimensionado a partir delas, e o canvas ocupa o que sobra.
 *
 * O popover vive aqui dentro em vez de num serviço central porque ele é ancorado
 * a *este* card — à direita dele, com 8px de folga. Centralizar a ancoragem
 * exigiria medir a posição de cada card e repassá-la, para chegar ao mesmo
 * lugar.
 */
@Component({
  selector: 'z-create-control-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideLock,
      lucideLockOpen,
      lucideMoon,
      lucideShapes,
      lucideSun,
      lucideTextCursor,
    }),
  ],
  host: {
    class: 'relative block',
    '(document:keydown.escape)': 'close()',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <button
      type="button"
      class="flex h-[52px] w-[200px] items-center justify-between rounded-[10px] py-2 pr-2.5 pl-2.5 text-left transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
      [attr.aria-expanded]="open()"
      aria-haspopup="listbox"
      (click)="toggle()"
    >
      <span class="flex flex-col gap-0.5 overflow-hidden">
        <span class="text-[11px] leading-none font-medium text-white/70">{{ control().label }}</span>
        <span class="truncate text-sm leading-tight font-semibold text-white">{{ control().value }}</span>
      </span>

      <!-- O espaço à esquerda é do cadeado, que fica por cima como irmão deste
           botão: um controle interativo dentro de outro não tem como ser
           alcançado por teclado nem anunciado por leitor de tela. -->
      <span class="flex shrink-0 items-center pl-7">
        @if (control().swatch) {
          <span
            class="size-5 rounded-full ring-1 ring-white/20"
            [style.background]="control().swatch"
            [attr.aria-label]="control().value"
          ></span>
        } @else if (control().id === 'radius') {
          <!-- A curva desenhada é o indicador honesto de um raio: um número
               obrigaria a pessoa a imaginar o que ele produz. -->
          <span
            class="size-5 border-t-2 border-l-2 border-white/70"
            [style.border-top-left-radius]="radiusPreview()"
          ></span>
        } @else {
          <!-- Um glifo diz o que o controle faz; três letras cortadas do valor
               ("CLA", "LUC") não dizem nada que o próprio valor já não diga. -->
          <ng-icon [name]="indicatorIcon()" size="16" class="text-white/75" />
        }
      </span>
    </button>

    <!-- Aparece no hover do card, e fica visível enquanto travado: sem isso não
         haveria como saber o que o Shuffle vai preservar. -->
    <button
      type="button"
      class="absolute top-1/2 right-9 grid size-5 -translate-y-1/2 place-items-center rounded transition-opacity group-hover:opacity-100 hover:bg-white/10 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
      [class.opacity-0]="!locked()"
      [attr.aria-pressed]="locked()"
      [attr.aria-label]="locked() ? 'Unlock ' + control().label : 'Lock ' + control().label"
      (click)="lockToggled.emit(control().id)"
    >
      <ng-icon [name]="locked() ? 'lucideLock' : 'lucideLockOpen'" class="text-white/75" size="12" />
    </button>

    @if (open()) {
      <div
        class="absolute top-0 left-[calc(100%+8px)] z-50 max-h-[320px] w-[184px] overflow-y-auto rounded-[10px] bg-[oklch(0.205_0_0)] p-1 shadow-xl ring-1 ring-white/10"
        role="listbox"
        [attr.aria-label]="control().label"
      >
        @for (option of control().options; track option.id) {
          <button
            type="button"
            role="option"
            [attr.aria-selected]="option.label === control().value"
            class="flex h-[26px] w-full items-center justify-between rounded-md px-2 text-[13px] text-white/90 transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
            (click)="choose(option.id)"
          >
            <span class="truncate">{{ option.label }}</span>
            @if (option.label === control().value) {
              <ng-icon name="lucideCheck" size="12" class="shrink-0 text-white" />
            }
          </button>
        }
      </div>
    }
  `,
})
export class CreateControlCardComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly control = input.required<Control>();
  readonly locked = input(false);

  readonly selected = output<{ id: ControlId; value: string }>();
  readonly lockToggled = output<ControlId>();

  private readonly _open = signal(false);
  readonly open = this._open.asReadonly();

  /** O raio como a curva do indicador o mostra, num quadrado de 20px. */
  readonly radiusPreview = computed(() => {
    const step = this.control().value.toLowerCase();
    const previews: Record<string, string> = {
      none: '0px',
      small: '3px',
      medium: '5px',
      default: '7px',
      large: '10px',
    };

    return previews[step] ?? '7px';
  });

  /** O glifo do indicador para os controles que não têm cor nem curva. */
  readonly indicatorIcon = computed(() => {
    const control = this.control();

    if (control.id === 'icons') return 'lucideShapes';
    if (control.id === 'rtl') return 'lucideTextCursor';

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

  /** Clique fora do card fecha a lista — dentro dele, quem decide são os handlers do template. */
  onDocumentClick(event: MouseEvent): void {
    if (!this._open()) return;
    if (this.host.nativeElement.contains(event.target as Node)) return;

    this._open.set(false);
  }
}
