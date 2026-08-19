import { ChangeDetectionStrategy, Component, computed, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings2, lucideX } from '@ng-icons/lucide';

import { SeoService } from '@doc/shared/services/seo.service';

import { CreateCanvasComponent } from './components/create-canvas.component';
import { CreateCodeDialogComponent } from './components/create-code-dialog.component';
import { CreateMenuComponent } from './components/create-menu.component';
import { CreateBuilderService } from './services/create-builder.service';

/**
 * `/create` — o builder do design system.
 *
 * A página ocupa a altura da janela e não rola: quem rola é a lista de controles
 * e o canvas. O painel flutua sobre o canvas com um respiro, e o canvas é
 * cortado nas bordas de propósito (ver `create-canvas`).
 *
 * Abaixo de 1024px o painel vira uma folha acionada por um botão flutuante — em
 * 224px de controles sobre 390px de tela não sobraria preview nenhum, e o
 * preview é a razão da página existir.
 */
@Component({
  selector: 'z-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateMenuComponent, CreateCanvasComponent, CreateCodeDialogComponent, NgIcon],
  providers: [CreateBuilderService],
  viewProviders: [provideIcons({ lucideSettings2, lucideX })],
  template: `
    <main class="relative flex h-[calc(100svh-4rem)] overflow-hidden p-4">
      <div class="bg-muted h-full w-full overflow-hidden rounded-[18px]">
        <z-create-canvas />
      </div>

      @if (sheetOpen()) {
        <div class="fixed inset-0 z-90 bg-black/50 lg:hidden" (click)="sheetOpen.set(false)"></div>
      }

      <!-- Um painel só, posicionado de dois jeitos. Renderizar dois deixaria o
           de baixo no DOM em toda largura de tela: invisível para quem olha,
           presente para o leitor de tela e para quem navega por teclado. -->
      <div [class]="menuClasses()">
        <z-create-menu (getCode)="onGetCode()" />
      </div>

      <button
        type="button"
        class="bg-foreground text-background fixed right-6 bottom-6 z-90 flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium shadow-lg lg:hidden"
        [attr.aria-expanded]="sheetOpen()"
        (click)="sheetOpen.set(!sheetOpen())"
      >
        <ng-icon [name]="sheetOpen() ? 'lucideX' : 'lucideSettings2'" size="16" />
        {{ sheetOpen() ? 'Close' : 'Customise' }}
      </button>

      @if (warning()) {
        <p
          class="bg-background text-foreground absolute top-8 left-1/2 z-80 -translate-x-1/2 rounded-full border px-3 py-1.5 text-xs shadow-sm"
          role="status"
          aria-label="Preset link notice"
        >
          {{ warning() }}
        </p>
      }
    </main>

    @if (dialogOpen()) {
      <z-create-code-dialog (closed)="dialogOpen.set(false)" />
    }
  `,
})
export class CreatePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly builder = inject(CreateBuilderService);

  readonly sheetOpen = signal(false);
  readonly dialogOpen = signal(false);
  readonly warning = signal<string | null>(null);

  /**
   * Onde o painel fica, e se ele está lá.
   *
   * Em telas grandes ele flutua sobre o canvas; abaixo de 1024px vira uma folha
   * que só existe quando pedida — 224px de controles sobre 390px de tela não
   * deixariam preview nenhum, e o preview é a razão da página existir.
   */
  readonly menuClasses = computed(() =>
    this.sheetOpen()
      ? 'fixed top-4 bottom-4 left-4 z-95 max-h-[calc(100%-2rem)] lg:absolute lg:top-8 lg:left-8'
      : 'absolute top-8 left-8 z-40 hidden max-h-[calc(100%-4rem)] lg:block',
  );

  /** Abrir o dialog por cima da folha empilharia duas camadas modais. */
  onGetCode(): void {
    this.sheetOpen.set(false);
    this.dialogOpen.set(true);
  }

  ngOnInit(): void {
    this.seo.setDocsSeo(
      'Create',
      'Build your zard/ui design system — base colour, accent, charts, radius and icons — and copy the command that sets it up.',
      '/create',
      'og-create.jpg',
    );

    const code = this.route.snapshot.queryParamMap.get('preset');
    if (!code) return;

    // Um link inválido abre a página no default com um aviso discreto. Deixar a
    // página em branco por causa de um código truncado numa mensagem seria
    // trocar um contratempo por uma parede.
    const result = this.builder.applyCode(code);
    if (result.ok) return;

    this.warning.set('That preset link could not be read, so this is the default one.');
    setTimeout(() => this.warning.set(null), 6000);
  }
}
