import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { Component, input } from '@angular/core';

import { AiAssistComponent } from '../ai-assist/ai-assist.component';

@Component({
  selector: 'z-doc-heading',
  standalone: true,
  imports: [ScrollSpyItemDirective, AiAssistComponent],
  template: `
    <header class="flex flex-col gap-8 sm:gap-10" [scrollSpyItem]="id() || 'overview'" [id]="id() || 'overview'">
      <div class="flex flex-col gap-6 sm:gap-8">
        <div class="relative flex justify-between items-center">
          <h1 class="text-4xl font-semibold scroll-m-20 tracking-tight sm:text-3xl xl:text-4xl">{{ title() }}</h1>
          <z-assist></z-assist>
        </div>
        <p class="text-lg sm:text-xl text-muted-foreground leading-relaxed">{{ description() }}</p>
      </div>
    </header>
  `,
})
export class DocHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly id = input<string>();
}
