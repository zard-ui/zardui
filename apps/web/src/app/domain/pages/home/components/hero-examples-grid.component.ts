import { Component, ChangeDetectionStrategy } from '@angular/core';

import {
  BlockEmptyAvatarGroupComponent,
  BlockSpinnerBadgesComponent,
  BlockInputGroupChatComponent,
  BlockFieldSliderComponent,
  BlockInputGroupStackComponent,
} from './blocks';
import { HeroDefaultContentComponent } from './hero-default-content.component';

/**
 * A parede de componentes, cortada por uma altura fixa e desbotada na base.
 *
 * O corte é o que diz "tem mais". Um grid que termina sozinho parece um catálogo
 * completo com poucos itens; um grid cortado no meio de um card parece o começo
 * de uma biblioteca — e é a segunda leitura que é verdadeira.
 *
 * O fade é um overlay absoluto, e não `mask-image`: a máscara cobraria composite
 * do elemento inteiro em cada scroll, e esta é a página mais visitada do site.
 */
@Component({
  selector: 'z-hero-examples-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockEmptyAvatarGroupComponent,
    BlockSpinnerBadgesComponent,
    BlockInputGroupChatComponent,
    BlockFieldSliderComponent,
    BlockInputGroupStackComponent,
    HeroDefaultContentComponent,
  ],
  template: `
    <div class="container-wrapper flex-1 pb-6">
      <!-- O recorte precisa estar aqui também, e não só no wrapper: o grid é mais
           alto que os 1414px, e sem isto o navegador estende a área de rolagem
           até onde ele iria — meia tela em branco depois do rodapé. -->
      <div class="relative container overflow-hidden">
        <section class="flex flex-col gap-6 *:w-full *:max-w-full md:hidden">
          <z-block-empty-avatar-group />
          <z-block-spinner-badges />
          <z-block-input-group-chat />
          <z-block-field-slider />
          <z-block-input-group-stack />
        </section>

        <section class="theme-container hidden h-[1414px] overflow-hidden md:block">
          <z-hero-default-content />
        </section>

        <div
          class="from-background pointer-events-none absolute inset-x-0 bottom-0 hidden h-64 bg-linear-to-t to-transparent md:block"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  `,
})
export class HeroExamplesGridComponent {}
