import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { Step } from '@zard/shared/constants/install.constant';

import { MarkdownRendererComponent } from '../render/markdown-renderer.component';

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

              @if (stepProps()?.url) {
                <a z-button zType="link" class="p-0" [href]="stepProps()?.url?.href" [target]="stepProps()?.url?.external ? '_blank' : '_self'">{{ stepProps()?.url?.text }}</a>
              }
            </p>
            @if (stepProps()?.file?.path) {
              @if (stepProps()?.expandable) {
                <div class="space-y-3">
                  <div class="flex items-center justify-between py-2">
                    <button
                      z-button
                      zType="outline"
                      class="flex items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      (click)="toggleExpanded()"
                    >
                      <i [class]="'icon-' + (isExpanded() ? 'chevron-down' : 'chevron-right') + ' w-4 h-4 mr-1 transition-transform'"></i>
                      {{ isExpanded() ? 'Hide' : 'Show' }} {{ getExpandButtonText() }}
                    </button>
                  </div>
                  @if (isExpanded()) {
                    <div class="overflow-hidden transition-all duration-200 ease-in-out animate-in slide-in-from-top-1">
                      <z-markdown-renderer [markdownUrl]="stepProps()!.file!.path"></z-markdown-renderer>
                    </div>
                  }
                </div>
              } @else {
                <z-markdown-renderer [markdownUrl]="stepProps()!.file!.path"></z-markdown-renderer>
              }
            }
          </section>
        </main>
      </article>
    }
  `,
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, MarkdownRendererComponent],
})
export class StepComponent {
  readonly stepProps = input<Step>();
  readonly position = input<number>();
  readonly isExpanded = signal(false);

  toggleExpanded() {
    this.isExpanded.update(value => !value);
  }

  getExpandButtonText(): string {
    const title = this.stepProps()?.title?.toLowerCase() || '';

    if (title.includes('component') || title.includes('files')) {
      return 'component files';
    } else if (title.includes('code')) {
      return 'code';
    } else if (title.includes('util')) {
      return 'utility code';
    }

    return 'code';
  }
}
