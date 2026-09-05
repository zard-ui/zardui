import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardIdDirective } from '@zard/core';

@Component({
  selector: 'z-card-new-milestone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardIdDirective, ZardCardImports, ZardFieldImports, ZardInputComponent, ZardButtonComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Set a new milestone" />
        <p z-card-description zDescription="Define your financial target and we'll help you pace your savings."></p>
      </z-card-header>

      <z-card-content>
        <div z-field-group>
          <div z-field zardId="milestone-goal" #goal="zardId">
            <label z-field-label [for]="goal.id()">Goal Name</label>
            <input z-input [id]="goal.id()" placeholder="e.g. New Car, Home Downpayment" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div z-field zardId="milestone-amount" #amount="zardId">
              <label z-field-label [for]="amount.id()">Target Amount</label>
              <input z-input [id]="amount.id()" value="$15,000" />
            </div>
            <div z-field zardId="milestone-date" #date="zardId">
              <label z-field-label [for]="date.id()">Target Date</label>
              <input z-input [id]="date.id()" value="Dec 2025" />
            </div>
          </div>
        </div>
      </z-card-content>

      <z-card-content class="flex flex-col gap-2">
        <button type="button" z-button class="w-full">Create Goal</button>
        <button type="button" z-button zType="outline" class="w-full">Cancel</button>
      </z-card-content>
    </z-card>
  `,
})
export class CardNewMilestoneComponent {}
