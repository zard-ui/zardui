import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zType="outline" [zContent]="popoverContent">Open popover</button>

    <ng-template #popoverContent>
      <z-popover class="w-80">
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>

        <div class="grid gap-2">
          @for (dimension of dimensions; track dimension.id) {
            <div class="grid grid-cols-3 items-center gap-4">
              <label class="text-sm" [attr.for]="dimension.id">{{ dimension.label }}</label>
              <input
                z-input
                type="text"
                class="col-span-2 h-8"
                [id]="dimension.id"
                [value]="dimension.value"
                [attr.aria-label]="dimension.label"
              />
            </div>
          }
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPreviewComponent {
  readonly dimensions = [
    { id: 'width', label: 'Width', value: '100%' },
    { id: 'maxWidth', label: 'Max. width', value: '300px' },
    { id: 'height', label: 'Height', value: '25px' },
    { id: 'maxHeight', label: 'Max. height', value: 'none' },
  ];
}
