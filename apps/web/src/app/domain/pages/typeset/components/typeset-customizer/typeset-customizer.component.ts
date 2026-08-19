import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { FLOW_CHOICES, LEADING_CHOICES, MEASURE_CHOICES, SCALE_CHOICES } from '../../data/options.data';
import type { TypesetChoice } from '../../models/typeset.model';
import { TypesetGeneratorService } from '../../services/typeset-generator.service';
import { FontPickerComponent } from '../font-picker/font-picker.component';
import { OptionPickerComponent } from '../option-picker/option-picker.component';

@Component({
  selector: 'app-typeset-customizer',
  standalone: true,
  imports: [FontPickerComponent, OptionPickerComponent, ZardButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex h-full flex-col' },
  template: `
    <div class="flex-1 overflow-y-auto p-4 sm:p-6">
      <div class="flex flex-col gap-5">
        <app-option-picker
          label="Measure"
          controlId="typeset-measure"
          [choices]="measureChoices"
          [value]="service.state().measure"
          (valueChange)="service.setMeasure($event)"
        />

        <hr class="border-border" />

        <app-font-picker
          label="Heading"
          controlId="typeset-heading"
          [fonts]="service.headingFonts"
          [value]="service.state().heading"
          [allowInherit]="true"
          (valueChange)="service.setHeading($event)"
        />

        <app-font-picker
          label="Body"
          controlId="typeset-body"
          [fonts]="service.bodyFonts"
          [value]="service.state().body"
          (valueChange)="service.setBody($event)"
        />

        <app-font-picker
          label="Mono"
          controlId="typeset-mono"
          [fonts]="service.monoFonts"
          [value]="service.state().mono"
          (valueChange)="service.setMono($event)"
        />

        <hr class="border-border" />

        <app-option-picker
          label="Size"
          controlId="typeset-size"
          [choices]="scaleChoices"
          [value]="service.state().scale"
          (valueChange)="service.setScale($event)"
        />

        <app-option-picker
          label="Leading"
          controlId="typeset-leading"
          [choices]="leadingChoices"
          [value]="service.state().leading"
          (valueChange)="service.setLeading($event)"
        />

        <app-option-picker
          label="Flow"
          controlId="typeset-flow"
          [choices]="flowChoices"
          [value]="service.state().flow"
          (valueChange)="service.setFlow($event)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2 border-t p-4 sm:p-6">
      <button z-button zType="outline" class="w-full" (click)="service.randomize()">Randomize</button>
      <button z-button class="w-full" (click)="getCode.emit()">Get code</button>
    </div>
  `,
})
export class TypesetCustomizerComponent {
  protected readonly service = inject(TypesetGeneratorService);

  readonly getCode = output<void>();

  protected readonly scaleChoices = SCALE_CHOICES;
  protected readonly leadingChoices = LEADING_CHOICES;
  protected readonly flowChoices = FLOW_CHOICES;

  /** The measure control shows the character count; the width is an implementation detail. */
  protected readonly measureChoices: readonly TypesetChoice<number>[] = MEASURE_CHOICES.map(choice => ({
    value: choice.value,
    label: String(choice.value),
  }));
}
