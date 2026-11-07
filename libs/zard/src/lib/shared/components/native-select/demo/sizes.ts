import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-sizes',
  imports: [ZardNativeSelectDirective],
  template: `
    <div class="flex w-64 flex-col gap-4">
      <select z-native-select zSize="sm" aria-label="Small">
        <option>Small</option>
        <option>Option two</option>
      </select>
      <select z-native-select aria-label="Default">
        <option>Default</option>
        <option>Option two</option>
      </select>
      <select z-native-select zSize="lg" aria-label="Large">
        <option>Large</option>
        <option>Option two</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectSizesComponent {}
