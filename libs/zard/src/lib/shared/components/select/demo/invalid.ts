import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFormImports } from '@/shared/components/form';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-invalid',
  imports: [ZardFormImports, ZardSelectImports],
  template: `
    <z-form-field class="w-75" data-invalid>
      <z-form-label>Fruit</z-form-label>
      <z-select zPlaceholder="Select a fruit" zInvalid [(zValue)]="selectedFruit">
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
        <z-select-item zValue="pineapple">Pineapple</z-select-item>
      </z-select>
      <z-form-message zType="error">Please select a fruit.</z-form-message>
    </z-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectInvalidComponent {
  readonly selectedFruit = signal('');
}
