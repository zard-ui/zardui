import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';
import { Step } from '@doc/shared/constants/install.constant';

import { ZardButtonComponent } from '@zard/components/button/button.component';

@Component({
  selector: 'z-step',
  template: `
    @if (stepProps() && position()) {
      <article class="relative">
        <header
          class="border-background absolute flex h-9 w-9 items-center justify-center rounded-full border-[3px] bg-neutral-300 select-none dark:bg-neutral-800"
        >
          <span class="text-primary font-semibold">{{ position() }}</span>
        </header>
        <main class="ml-[1.1rem] border-l border-neutral-200 dark:border-neutral-900">
          <section class="space-y-4 pt-1 pb-10 pl-8">
            <h2 class="text-primary font-medium">{{ stepProps()?.title }}</h2>
            <p>
              {{ stepProps()?.subtitle }}

              @if (stepProps()?.url && stepProps()?.url?.external) {
                <a z-button zType="link" class="p-0" [href]="stepProps()?.url?.href" target="_blank">
                  {{ stepProps()?.url?.text }}
                </a>
              }

              @if (stepProps()?.url && !stepProps()?.url?.external) {
                <a z-button zType="link" class="p-0" [routerLink]="stepProps()?.url?.href">
                  {{ stepProps()?.url?.text }}
                </a>
              }
            </p>
            @if (stepProps()?.file?.path) {
              <z-markdown-renderer [markdownUrl]="stepProps()!.file!.path"></z-markdown-renderer>
            }
          </section>
        </main>
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, MarkdownRendererComponent, RouterLink],
})
export class StepComponent {
  readonly stepProps = input<Step>();
  readonly position = input<number>();
}
