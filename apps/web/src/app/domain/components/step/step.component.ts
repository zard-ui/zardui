import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData } from '@highlight/types';

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

            @if (stepProps()?.codeTabData) {
              <z-code-tabs [data]="stepProps()!.codeTabData!" />
            } @else if (stepProps()?.codeBlockData) {
              @if (isCodeBlockArray(stepProps()!.codeBlockData!)) {
                @for (block of asCodeBlockArray(stepProps()!.codeBlockData!); track $index) {
                  <z-code-block [data]="block" />
                }
              } @else {
                <z-code-block [data]="asCodeBlock(stepProps()!.codeBlockData!)" />
              }
            } @else if (stepProps()?.file?.path) {
              <z-markdown-renderer [markdownUrl]="stepProps()!.file!.path"></z-markdown-renderer>
            }
          </section>
        </main>
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, MarkdownRendererComponent, RouterLink, CodeBlockComponent, CodeTabsComponent],
})
export class StepComponent {
  readonly stepProps = input<Step>();
  readonly position = input<number>();

  isCodeBlockArray(data: unknown): boolean {
    return Array.isArray(data);
  }

  asCodeBlockArray(data: unknown): CodeBlockData[] {
    return data as CodeBlockData[];
  }

  asCodeBlock(data: unknown): CodeBlockData {
    return data as CodeBlockData;
  }
}
