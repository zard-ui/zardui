import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@zard/components/field';
import { ZardNativeSelectDirective } from '@zard/components/native-select';

import { ExampleImports } from './example.component';

/** shadcn/ui's `native-select-example`, in zard. */
@Component({
  selector: 'z-native-select-example',
  imports: [ExampleImports, ZardFieldImports, ZardNativeSelectDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <select z-native-select class="w-fit">
          <option value="">Select a fruit</option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="blueberry">Blueberry</option>
          <option value="grapes" disabled>Grapes</option>
          <option value="pineapple">Pineapple</option>
        </select>
      </z-example>

      <z-example zTitle="With Groups">
        <select z-native-select class="w-fit">
          <option value="">Select a food</option>
          <optgroup label="Fruits">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="blueberry">Blueberry</option>
          </optgroup>
          <optgroup label="Vegetables">
            <option value="carrot">Carrot</option>
            <option value="broccoli">Broccoli</option>
            <option value="spinach">Spinach</option>
          </optgroup>
        </select>
      </z-example>

      <z-example zTitle="Sizes">
        <div class="flex flex-col gap-4">
          <select z-native-select zSize="sm" class="w-fit">
            <option value="">Select a fruit</option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="blueberry">Blueberry</option>
          </select>
          <select z-native-select zSize="default" class="w-fit">
            <option value="">Select a fruit</option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="blueberry">Blueberry</option>
          </select>
        </div>
      </z-example>

      <z-example zTitle="With Field">
        <div z-field>
          <label z-field-label for="native-select-country">Country</label>
          <select z-native-select id="native-select-country" class="w-fit!">
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </select>
          <p z-field-description>Select your country of residence.</p>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <select z-native-select class="w-fit" disabled>
          <option value="">Disabled</option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="blueberry">Blueberry</option>
        </select>
      </z-example>

      <z-example zTitle="Invalid">
        <select z-native-select class="w-fit" aria-invalid="true">
          <option value="">Error state</option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="blueberry">Blueberry</option>
        </select>
      </z-example>
    </z-example-wrapper>
  `,
})
export class NativeSelectExampleComponent {}
