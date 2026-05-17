import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-default',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-full min-w-48" zPlaceholder="Select a fruit" [(zValue)]="selectedFruit">
      <z-select-label>Fruits</z-select-label>
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple">Pineapple</z-select-item>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectDefaultComponent {
  readonly selectedFruit = signal('');
}
