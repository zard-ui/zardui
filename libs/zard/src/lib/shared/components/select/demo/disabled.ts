import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-disabled',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-75" zPlaceholder="Select a fruit" [(zValue)]="selectedFruit">
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple" zDisabled>Pineapple</z-select-item>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectDisabledComponent {
  readonly selectedFruit = signal('');
}
