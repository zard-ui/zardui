import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-align-demo',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <div class="flex gap-6">
      @for (alignment of alignments; track alignment.align) {
        <button
          type="button"
          z-button
          zPopover
          zSize="sm"
          zType="outline"
          [zAlign]="alignment.align"
          [zContent]="popoverContent"
        >
          {{ alignment.label }}
        </button>

        <ng-template #popoverContent>
          <z-popover class="w-40">{{ alignment.content }}</z-popover>
        </ng-template>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverAlignComponent {
  readonly alignments = [
    { align: 'start', label: 'Start', content: 'Aligned to start' },
    { align: 'center', label: 'Center', content: 'Aligned to center' },
    { align: 'end', label: 'End', content: 'Aligned to end' },
  ] as const;
}
