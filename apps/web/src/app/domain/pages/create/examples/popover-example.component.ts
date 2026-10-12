import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardDialogImports } from '@zard/components/dialog';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardPopoverImports } from '@zard/components/popover';

import { ExampleImports } from './example.component';

const ALIGNMENTS = [
  { align: 'start', label: 'Start', content: 'Aligned to start' },
  { align: 'center', label: 'Center', content: 'Aligned to center' },
  { align: 'end', label: 'End', content: 'Aligned to end' },
] as const;

/** shadcn/ui's `popover-example`, in zard. */
@Component({
  selector: 'z-popover-example',
  imports: [
    ExampleImports,
    ZardButtonComponent,
    ZardDialogImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardPopoverImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <button type="button" z-button zType="outline" zPopover zAlign="start" [zContent]="basic">Open Popover</button>
        <ng-template #basic>
          <z-popover>
            <div z-popover-header>
              <h4 z-popover-title>Dimensions</h4>
              <p z-popover-description>Set the dimensions for the layer.</p>
            </div>
          </z-popover>
        </ng-template>
      </z-example>

      <z-example zTitle="With Form">
        <button type="button" z-button zType="outline" zPopover zAlign="start" [zContent]="form">Open Popover</button>
        <ng-template #form>
          <z-popover class="w-64">
            <div z-popover-header>
              <h4 z-popover-title>Dimensions</h4>
              <p z-popover-description>Set the dimensions for the layer.</p>
            </div>
            <div z-field-group class="gap-4">
              <div z-field zOrientation="horizontal">
                <label z-field-label for="width" class="w-1/2">Width</label>
                <input z-input id="width" value="100%" />
              </div>
              <div z-field zOrientation="horizontal">
                <label z-field-label for="height" class="w-1/2">Height</label>
                <input z-input id="height" value="25px" />
              </div>
            </div>
          </z-popover>
        </ng-template>
      </z-example>

      <z-example zTitle="Alignments">
        <div class="flex gap-6">
          @for (alignment of alignments; track alignment.align) {
            <button
              type="button"
              z-button
              zType="outline"
              zSize="sm"
              zPopover
              [zAlign]="alignment.align"
              [zContent]="aligned"
            >
              {{ alignment.label }}
            </button>
            <ng-template #aligned>
              <z-popover class="w-40">{{ alignment.content }}</z-popover>
            </ng-template>
          }
        </div>
      </z-example>

      <z-example zTitle="In Dialog">
        <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">Open Dialog</button>
        <z-dialog [(zVisible)]="dialogOpen">
          <z-dialog-header>
            <z-dialog-title>Popover Example</z-dialog-title>
            <z-dialog-description>Click the button below to see the popover.</z-dialog-description>
          </z-dialog-header>
          <button type="button" z-button zType="outline" class="w-fit" zPopover zAlign="start" [zContent]="inDialog">
            Open Popover
          </button>
        </z-dialog>
        <ng-template #inDialog>
          <z-popover>
            <div z-popover-header>
              <h4 z-popover-title>Popover in Dialog</h4>
              <p z-popover-description>This popover appears inside a dialog. Click the button to open it.</p>
            </div>
          </z-popover>
        </ng-template>
      </z-example>
    </z-example-wrapper>
  `,
})
export class PopoverExampleComponent {
  protected readonly alignments = ALIGNMENTS;
  protected readonly dialogOpen = signal(false);
}
