import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupComponent } from '@/shared/components/input-group/input-group.component';

@Component({
  selector: 'z-demo-input-input-group',
  imports: [ZardInputComponent, ZardInputGroupComponent, NgIcon, ...ZardFieldImports],
  viewProviders: [provideIcons({ lucideInfo })],
  template: `
    <div z-field class="w-80">
      <label z-field-label for="input-group-url">Website URL</label>
      <z-input-group zAddonBefore="https://" [zAddonAfter]="infoIcon">
        <input z-input id="input-group-url" placeholder="example.com" />
      </z-input-group>
    </div>
    <ng-template #infoIcon>
      <ng-icon name="lucideInfo" />
    </ng-template>
  `,
})
export class ZardDemoInputInputGroupComponent {}
