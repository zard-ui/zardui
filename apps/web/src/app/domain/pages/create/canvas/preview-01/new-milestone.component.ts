import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';

@Component({
  selector: 'z-preview-01-new-milestone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardInputComponent, ZardButtonComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Set a new milestone" />
        <z-card-description zDescription="Define your financial target and we'll help you pace your savings." />
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p01-goal-name">Goal Name</label>
            <input z-input id="p01-goal-name" placeholder="e.g. New Car, Home Downpayment" />
          </z-field>
          <div class="grid grid-cols-2 gap-3">
            <z-field>
              <label z-field-label for="p01-target-amount">Target Amount</label>
              <input z-input id="p01-target-amount" value="$15,000" />
            </z-field>
            <z-field>
              <label z-field-label for="p01-target-date">Target Date</label>
              <input z-input id="p01-target-date" value="Dec 2025" />
            </z-field>
          </div>
        </z-field-group>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <button type="button" z-button class="w-full">Create Goal</button>
        <button type="button" z-button zType="outline" class="w-full">Cancel</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01NewMilestoneComponent {}
