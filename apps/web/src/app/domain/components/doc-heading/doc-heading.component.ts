import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { AiAssistComponent } from '../ai-assist/ai-assist.component';

@Component({
  selector: 'z-doc-heading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollSpyItemDirective, AiAssistComponent],
  template: `
    <header class="flex flex-col gap-2" [scrollSpyItem]="id() || 'overview'" [id]="id() || 'overview'">
      <div class="flex flex-col gap-2">
        <div class="relative flex items-start justify-between">
          <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">{{ title() }}</h1>
          <z-assist></z-assist>
        </div>
        <p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">{{ description() }}</p>
      </div>
    </header>
  `,
})
export class DocHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly id = input<string>();
}
