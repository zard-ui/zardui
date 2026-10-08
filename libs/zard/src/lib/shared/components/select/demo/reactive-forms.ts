import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-reactive-forms',
  imports: [...ZardSelectImports, ...ZardFieldImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="w-full min-w-xs">
        <div z-field>
          <label z-field-label for="reactive-select-fruit">Favorite fruit</label>
          <z-select id="reactive-select-fruit" formControlName="fruit" zPlaceholder="Select a fruit">
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
            <z-select-item zValue="blueberry">Blueberry</z-select-item>
            <z-select-item zValue="grapes">Grapes</z-select-item>
            <z-select-item zValue="pineapple">Pineapple</z-select-item>
          </z-select>
        </div>
        <div z-field>
          <label z-field-label for="reactive-select-toppings">Toppings</label>
          <z-select id="reactive-select-toppings" formControlName="toppings" zPlaceholder="Select toppings" zMultiple>
            <z-select-item zValue="chocolate">Chocolate</z-select-item>
            <z-select-item zValue="caramel">Caramel</z-select-item>
            <z-select-item zValue="nuts">Nuts</z-select-item>
            <z-select-item zValue="sprinkles">Sprinkles</z-select-item>
          </z-select>
        </div>
        <p class="text-muted-foreground text-sm">
          Fruit: {{ form.controls.fruit.value || 'none' }} · Toppings:
          {{ form.controls.toppings.value.length ? form.controls.toppings.value.join(', ') : 'none' }}
        </p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectReactiveFormsComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    fruit: ['banana'],
    toppings: [['chocolate', 'nuts'] as string[]],
  });
}
