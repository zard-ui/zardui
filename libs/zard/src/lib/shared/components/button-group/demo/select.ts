import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardSelectComponent } from '@/shared/components/select/select.component';

@Component({
  selector: 'z-demo-button-group-select',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardInputComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    NgIcon,
  ],
  template: `
    <z-button-group>
      <z-button-group>
        <z-select [(zValue)]="currency" [zLabel]="currency()" class="w-fit [&_button]:font-mono">
          @for (cur of CURRENCIES; track cur.value) {
            <z-select-item [zValue]="cur.value">
              {{ cur.value }}
              <span class="text-muted-foreground">{{ cur.label }}</span>
            </z-select-item>
          }
        </z-select>
        <input z-input placeholder="10.00" pattern="[0-9]*" />
      </z-button-group>
      <z-button-group>
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Send">
          <ng-icon name="lucideArrowRight" />
        </button>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucideArrowRight })],
})
export class ZardDemoButtonGroupSelectComponent {
  protected readonly CURRENCIES = [
    { value: '$', label: 'US Dollar' },
    { value: '€', label: 'Euro' },
    { value: '£', label: 'British Pound' },
  ];

  protected readonly currency = signal('$');
}
