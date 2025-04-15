import { ZardButtonComponent } from '@zard/components/button/button.component';
import { Step } from '@zard/shared/constants/install.constant';
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZardMarkdownComponent } from '../markdown/markdown.component';

@Component({
  selector: 'z-step',
  template: `
    @if (stepProps() && position()) {
      <article class="relative">
        <header class="absolute flex h-9 w-9 select-none items-center justify-center rounded-full border-[3px] border-background bg-neutral-300 dark:bg-neutral-800">
          <span class="font-semibold text-primary">{{ position() }}</span>
        </header>
        <main class="ml-[1.1rem] border-l border-neutral-200 dark:border-neutral-900">
          <section class="space-y-4 pb-10 pl-8 pt-1">
            <h2 class="font-medium text-primary">{{ stepProps()?.title }}</h2>
            <p>
              {{ stepProps()?.subtitle }}

              @if (!stepProps()?.url?.external) {
                <a z-button zType="link" class="p-0" [href]="stepProps()?.url?.href">{{ stepProps()?.url?.text }}</a>
              }
            </p>
            @if (stepProps()?.url?.external) {
              <a z-button zType="link" class="p-0" [href]="stepProps()?.url?.href" target="_blank">{{ stepProps()?.url?.text }}</a>
            }
            @if (stepProps()?.file) {
              <z-markdown [src]="'documentation/install' + stepProps()?.file" [codeBox]="true"></z-markdown>
            }
          </section>
        </main>
      </article>
    }
  `,
  standalone: true,
  imports: [CommonModule, ZardMarkdownComponent, ZardButtonComponent],
})
export class StepComponent {
  readonly stepProps = input<Step>();
  readonly position = input<number>();
}
