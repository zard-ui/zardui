import { Component, input } from '@angular/core';

import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';

import { AiAssistComponent } from '../ai-assist/ai-assist.component';

@Component({
  selector: 'z-doc-heading',
  standalone: true,
  imports: [ScrollSpyItemDirective, AiAssistComponent],
  template: `
    <header class="flex flex-col gap-8 sm:gap-10" [scrollSpyItem]="id() || 'overview'" [id]="id() || 'overview'">
      <div class="flex flex-col gap-6 sm:gap-8">
        <div class="relative flex items-center justify-between">
          <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">{{ title() }}</h1>
          <z-assist></z-assist>
        </div>
        <p class="text-muted-foreground text-lg leading-relaxed sm:text-xl">{{ description() }}</p>
      </div>
    </header>
  `,
})
export class DocHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly id = input<string>();
}
