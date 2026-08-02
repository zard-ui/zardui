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
          <div class="flex flex-col gap-2">
            <p class="text-muted-foreground text-xs sm:text-sm">
              <span class="text-foreground font-medium">Cause:</span>
              <span [innerHTML]="entry.cause | inlineCode"></span>
            </p>
            <p class="text-muted-foreground text-xs sm:text-sm">
              <span class="text-foreground font-medium">Fix:</span>
              <span [innerHTML]="entry.fix | inlineCode"></span>
            </p>
          </div>
        </z-accordion-item>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TroubleshootingListComponent {
  readonly entries = TROUBLESHOOTING;
}
