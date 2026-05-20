import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-invalid',
  imports: [...ZardFieldImports, ZardSelectImports],
  template: `
    <div z-field class="w-full min-w-48" data-invalid="true">
      <label z-field-label for="select-invalid">Fruit</label>
      <z-select id="select-invalid" zPlaceholder="Select a fruit" zInvalid [(zValue)]="selectedFruit">
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
        <z-select-item zValue="pineapple">Pineapple</z-select-item>
      </z-select>
      <z-field-error>Please select a fruit.</z-field-error>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectInvalidComponent {
  readonly selectedFruit = signal('');
}
