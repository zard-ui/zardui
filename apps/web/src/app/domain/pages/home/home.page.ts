import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { CardsWallComponent } from './components/cards-wall.component';
import { HeroHeaderComponent } from './components/hero-header.component';

/**
 * A home: um cabeçalho e a parede de componentes.
 *
 * Abaixo de `md` a parede vira **uma imagem**. Não é preguiça: renderizar
 * dezesseis cards interativos para mostrá-los a 140vw de largura, cortados,
 * custaria o hidrate inteiro da biblioteca no aparelho mais lento do funil para
 * produzir exatamente a mesma leitura — "olha o tanto de coisa que tem aqui".
 * A imagem entrega essa leitura por 160 KB e um decode.
 */
@Component({
  selector: 'z-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroHeaderComponent, CardsWallComponent],
  template: `
    <main class="flex flex-1 flex-col">
      <z-hero-header />

      <!-- A parede fica fora do container de propósito, e é a única coisa da
           home que fica.

           O container trava o conteúdo em 1536px no modo de layout fixo, e a
           quinta coluna só nasce a partir de 1712px de parede: dentro dele ela
           nunca apareceria, e a parede ficaria com 176px de folga de cada lado —
           uma faixa central de amostras em vez de uma parede. O que ela precisa
           comunicar é que a biblioteca não cabe na tela, e para isso ela tem que
           ir até a borda. -->
      <div class="w-full flex-1 overflow-hidden">
        <section class="-mx-4 w-[140vw] overflow-hidden md:hidden">
          <img
            src="/images/home-light.webp"
            width="2560"
            height="2764"
            alt="A wall of zard/ui components"
            class="block h-auto w-full dark:hidden"
            fetchpriority="high"
          />
          <img
            src="/images/home-dark.webp"
            width="2560"
            height="2764"
            alt="A wall of zard/ui components"
            class="hidden h-auto w-full dark:block"
            fetchpriority="high"
          />
        </section>

        <section class="hidden md:block">
          <z-cards-wall />
        </section>
      </div>
    </main>
  `,
})
export class HomePage implements OnInit {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setHomeSeo();
  }
}
