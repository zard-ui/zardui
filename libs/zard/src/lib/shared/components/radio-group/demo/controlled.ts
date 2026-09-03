import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-controlled',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, ZardButtonComponent],
  template: `
    <div z-field-group class="w-fit">
      <z-radio-group [value]="theme()" (valueChange)="theme.set($event)">
        <div class="flex items-center gap-3">
          <z-radio zId="controlled-light" value="light" />
          <label z-field-label for="controlled-light">Light</label>
        </div>
        <div class="flex items-center gap-3">
          <z-radio zId="controlled-dark" value="dark" />
          <label z-field-label for="controlled-dark">Dark</label>
        </div>
        <div class="flex items-center gap-3">
          <z-radio zId="controlled-system" value="system" />
          <label z-field-label for="controlled-system">System</label>
        </div>
      </z-radio-group>
      <p class="text-muted-foreground text-sm">Theme is set to {{ theme() }}.</p>
      <button type="button" z-button zType="outline" zSize="sm" (click)="theme.set('system')">Reset to system</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupControlledComponent {
  protected readonly theme = signal<unknown>('light');
}
