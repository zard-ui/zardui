import { Component, input } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { Step } from '../../../shared/constants/install.constant';
import { MarkdownRendererComponent } from '../render/markdown-renderer.component';

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

              @if (stepProps()?.url) {
                <a
                  z-button
                  zType="link"
                  class="p-0"
                  [href]="stepProps()?.url?.href"
                  [target]="stepProps()?.url?.external ? '_blank' : '_self'"
                  >{{ stepProps()?.url?.text }}</a
                >
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
  standalone: true,
  imports: [ZardButtonComponent, MarkdownRendererComponent],
})
export class StepComponent {
  readonly stepProps = input<Step>();
  readonly position = input<number>();
}
