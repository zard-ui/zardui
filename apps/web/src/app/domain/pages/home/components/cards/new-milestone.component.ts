import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

/**
 * O formulário curto: três campos e duas ações.
 *
 * Existe na parede para mostrar `field` + `input` no formato em que a maioria
 * dos produtos os usa — rótulo em cima, campo largo, e um par de botões
 * empilhados no rodapé.
 */
@Component({
  selector: 'z-card-new-milestone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardInputComponent, ZardButtonComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <h3 z-card-title zTitle="Set a new milestone"></h3>
        <p z-card-description zDescription="Define your financial target and we'll help you pace your savings."></p>
      </z-card-header>

      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="milestone-goal-name">Goal Name</label>
            <input z-input id="milestone-goal-name" placeholder="e.g. New Car, Home Downpayment" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div z-field>
              <label z-field-label for="milestone-amount">Target Amount</label>
              <input z-input id="milestone-amount" value="$15,000" />
            </div>
            <div z-field>
              <label z-field-label for="milestone-date">Target Date</label>
              <input z-input id="milestone-date" value="Dec 2025" />
            </div>
          </div>
        </div>
      </z-card-content>

      <z-card-footer class="flex-col gap-2">
        <button type="button" z-button class="w-full">Create Goal</button>
        <button type="button" z-button zType="outline" class="w-full">Cancel</button>
      </z-card-footer>
    </z-card>
  `,
})
export class CardNewMilestoneComponent {}
