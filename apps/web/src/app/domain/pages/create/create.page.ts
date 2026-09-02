import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SeoService } from '@doc/shared/services/seo.service';

import { CreateCanvasComponent } from './components/create-canvas.component';
import { CreateCodeDialogComponent } from './components/create-code-dialog.component';
import { CreateMenuComponent } from './components/create-menu.component';
import { CreateBuilderService } from './services/create-builder.service';

/**
 * `/create` — o builder do design system.
 *
 * A página ocupa a altura da janela e não rola: quem rola é a lista de controles
 * e o canvas. Em telas grandes é `flex-row-reverse` — o canvas vem primeiro no
 * DOM porque é ele o conteúdo, e o painel é a ferramenta; a inversão visual
 * coloca a ferramenta à esquerda, onde a leitura começa, sem inverter a ordem de
 * tabulação.
 *
 * Os atalhos vivem no painel, que é quem sabe o que cada um faz.
 */
@Component({
  selector: 'z-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateMenuComponent, CreateCanvasComponent, CreateCodeDialogComponent],
  providers: [CreateBuilderService],
  template: `
    <main
      class="section-soft relative flex h-[calc(100svh-var(--header-height))] min-h-0 flex-col overflow-hidden [--customizer-width:--spacing(56)] [--gap:--spacing(4)] md:[--gap:--spacing(6)] 2xl:[--customizer-width:--spacing(60)]"
    >
      <div class="flex min-h-0 flex-1 flex-col gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row-reverse">
        <z-create-canvas />
        <z-create-menu (getCode)="dialogOpen.set(true)" />
      </div>

      @if (warning()) {
        <p
          class="bg-background text-foreground absolute top-4 left-1/2 z-80 -translate-x-1/2 rounded-full border px-3 py-1.5 text-xs shadow-sm"
          role="status"
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

  readonly dialogOpen = signal(false);
  readonly warning = signal<string | null>(null);

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
