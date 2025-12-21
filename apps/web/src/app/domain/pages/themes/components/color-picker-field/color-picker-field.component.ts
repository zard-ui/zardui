import { ChangeDetectionStrategy, Component, computed, input, output, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputDirective } from '@zard/components/input/input.directive';

import { hexToOklch, isValidHex, isValidOklch, oklchToHex } from '../../utils/oklch-converter';

let colorPickerFieldId = 0;

@Component({
  selector: 'app-color-picker-field',
  standalone: true,
  imports: [FormsModule, ZardInputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div>
      <label [for]="inputId" class="text-muted-foreground mb-2 block text-xs font-medium capitalize">
        {{ formatLabel(colorKey()) }}
      </label>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            type="color"
            [value]="hexValue()"
            (input)="onColorPickerChange($event)"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div class="size-9 rounded-md border shadow-sm" [style.background-color]="hexValue()"></div>
        </div>
        <input
          z-input
          [id]="inputId"
          type="text"
          class="h-9 flex-1 font-mono text-xs"
          [ngModel]="oklchValue()"
          (ngModelChange)="onOklchInputChange($event)"
          (blur)="onInputBlur()"
          placeholder="oklch(0.5 0.1 180)"
        />
      </div>
    </div>
  `,
})
export class ColorPickerFieldComponent {
  readonly colorKey = input.required<string>();
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  readonly inputId = `color-picker-${colorPickerFieldId++}`;

  private readonly localValue = signal<string | null>(null);

  readonly oklchValue = computed(() => {
    return this.localValue() ?? this.value();
  });

  readonly hexValue = computed(() => {
    const oklch = this.oklchValue();
    return oklchToHex(oklch);
  });

  formatLabel(key: string): string {
    return key.replace(/-/g, ' ');
  }

  onColorPickerChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const hex = input.value;
    if (isValidHex(hex)) {
      const oklch = hexToOklch(hex);
      this.localValue.set(null);
      this.valueChange.emit(oklch);
    }
  }

  onOklchInputChange(value: string): void {
    this.localValue.set(value);
  }

  onInputBlur(): void {
    const value = this.localValue();
    if (value !== null) {
      if (isValidOklch(value)) {
        this.valueChange.emit(value);
      }
      this.localValue.set(null);
    }
  }
}
