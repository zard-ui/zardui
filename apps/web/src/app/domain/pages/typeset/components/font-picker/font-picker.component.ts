import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ZardSelectImports } from '@zard/components/select/select.imports';

import { INHERIT_HEADING, type TypesetFont } from '../../models/typeset.model';

@Component({
  selector: 'app-font-picker',
  standalone: true,
  imports: [ZardSelectImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between gap-3">
      <span class="text-muted-foreground shrink-0 text-xs font-medium" [id]="controlId()">
        {{ label() }}
      </span>

      <z-select class="w-40" [zPlaceholder]="label()" [zValue]="value()" (zSelectionChange)="onSelect($event)">
        @if (allowInherit()) {
          <z-select-item zValue="inherit">Same as body</z-select-item>
        }
        @for (font of fonts(); track font.id) {
          <z-select-item [zValue]="font.id">{{ font.label }}</z-select-item>
        }
      </z-select>
    </div>
  `,
})
export class FontPickerComponent {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly fonts = input.required<readonly TypesetFont[]>();
  readonly value = input.required<string>();
  /** The Heading slot alone may defer to the body face. */
  readonly allowInherit = input(false);

  readonly valueChange = output<string>();

  protected onSelect(value: string | string[]): void {
    const id = Array.isArray(value) ? value[0] : value;
    this.valueChange.emit(id ?? INHERIT_HEADING);
  }
}
