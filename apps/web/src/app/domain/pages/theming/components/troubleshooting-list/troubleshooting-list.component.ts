import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@zard/components/accordion/accordion.imports';

import { TROUBLESHOOTING } from '../../data/troubleshooting.data';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';

@Component({
  selector: 'z-troubleshooting-list',
  standalone: true,
  imports: [ZardAccordionImports, InlineCodePipe],
  template: `
    <div z-accordion zType="single" class="w-full">
      @for (entry of entries; track entry.id) {
        <z-accordion-item [zValue]="entry.id" [zTitle]="entry.symptom">
          <dl class="flex flex-col gap-1.5 text-xs sm:text-sm">
            <div class="flex gap-2">
              <dt class="text-foreground shrink-0 font-medium">Cause</dt>
              <dd class="text-muted-foreground" [innerHTML]="entry.cause | inlineCode"></dd>
            </div>
            <div class="flex gap-2">
              <dt class="text-foreground shrink-0 font-medium">Fix</dt>
              <dd class="text-muted-foreground" [innerHTML]="entry.fix | inlineCode"></dd>
            </div>
          </dl>
        </z-accordion-item>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TroubleshootingListComponent {
  readonly entries = TROUBLESHOOTING;
}
