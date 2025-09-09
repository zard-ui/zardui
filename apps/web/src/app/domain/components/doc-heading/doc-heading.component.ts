import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { Component, input } from '@angular/core';

@Component({
  selector: 'z-doc-heading',
  standalone: true,
  imports: [ScrollSpyItemDirective],
  template: `
    <header class="flex flex-col gap-8 sm:gap-10" [scrollSpyItem]="id() || 'overview'" [id]="id() || 'overview'">
      <div class="flex flex-col gap-4">
        <h1 class="text-4xl font-semibold scroll-m-20 tracking-tight sm:text-3xl xl:text-4xl">{{ title() }}</h1>
        <p class="text-muted-foreground text-[1.05rem] sm:text-base">{{ description() }}</p>
      </div>
    </header>
  `,
})
export class DocHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly id = input<string>();
}
