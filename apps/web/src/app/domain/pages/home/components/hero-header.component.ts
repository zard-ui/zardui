import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';

/**
 * O topo da home.
 *
 * As medidas vêm da referência: `padding: 80px 24px 48px`, `h1` de 48px/600 com
 * `letter-spacing` de −2.4px numa caixa de 811px, e parágrafo de 18px numa de
 * 896px. A caixa do `h1` é estreita de propósito — é ela que força a quebra em
 * duas linhas; deixá-la crescer com a tela transformaria o título numa linha só,
 * e a proporção entre título e parágrafo se perderia.
 *
 * O gradiente em "Angular" e o pill não são cópia de referência nenhuma: são a
 * marca do zard, e ficam.
 */
@Component({
  selector: 'z-hero-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, NgIcon],
  viewProviders: [provideIcons({ lucideArrowRight })],
  template: `
    <section class="border-grid">
      <div class="container-wrapper">
        <div class="container flex flex-col items-center gap-4 px-6 pt-20 pb-12 text-center">
          <z-badge routerLink="/create" zType="secondary">
            <span class="flex size-2 rounded-full bg-[#F80258]" title="New"></span>
            Build your design system in the browser
            <ng-icon name="lucideArrowRight" class="size-3" />
          </z-badge>
          <h1
            class="text-primary max-w-[811px] text-4xl leading-[1.1] font-semibold tracking-tighter text-balance xl:text-5xl"
          >
            The Next Level for Your
            <span class="bg-linear-to-r from-[#F80258] via-[#DC1E5A] to-[#5C4EE5] bg-clip-text text-transparent">
              Angular
            </span>
            Projects.
          </h1>
          <p class="text-foreground max-w-[896px] text-base leading-7 text-balance sm:text-lg">
            The shadcn/ui experience, built natively for Angular. Powered by Signals and TailwindCSS v4. SSR compatible,
            zoneless ready. No hassle, just results.
          </p>
          <!-- Um CTA primário. O segundo botão virou link porque dois botões de
               peso igual não são duas opções: são uma decisão a mais antes de
               começar. -->
          <div class="flex w-full flex-col items-center gap-3 pt-2">
            <a z-button routerLink="/docs/installation">
              Getting started
              <ng-icon name="lucideArrowRight" class="size-4" />
            </a>
            <a
              class="text-muted-foreground hover:text-foreground text-sm transition-colors"
              routerLink="/docs/components"
            >
              or browse the components
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroHeaderComponent {}
