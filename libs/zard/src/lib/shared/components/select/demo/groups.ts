import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-groups',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-75" zPlaceholder="Select a fruit" [(zValue)]="selectedFood">
      <z-select-group>
        <z-select-label>Fruits</z-select-label>
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Vegetables</z-select-label>
        <z-select-item zValue="aubergine">Aubergine</z-select-item>
        <z-select-item zValue="broccoli">Broccoli</z-select-item>
        <z-select-item zValue="carrot">Carrot</z-select-item>
        <z-select-item zValue="courgette">Courgette</z-select-item>
      </z-select-group>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectGroupsComponent {
  readonly selectedFood = signal('');
}
