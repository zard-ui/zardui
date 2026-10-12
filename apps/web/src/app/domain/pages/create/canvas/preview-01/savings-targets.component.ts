import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardItemImports } from '@zard/components/item';
import { ZardProgressComponent } from '@zard/components/progress';
import { ZardSelectImports } from '@zard/components/select';

const TARGETS = [
  { label: 'Retirement', target: '$420,000', progress: 65, saved: '$273,000' },
  { label: 'Real Estate', target: '$85,000', progress: 32, saved: '$27,200' },
] as const;

const ORDER_TYPES = [
  { value: 'market', label: 'Market Order' },
  { value: 'limit', label: 'Limit Order' },
  { value: 'stop', label: 'Stop Order' },
] as const;

/** shadcn's `NativeSelect` has no zard counterpart; the order type uses zard's select, the closest control. */
@Component({
  selector: 'z-preview-01-savings-targets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardFieldImports,
    ZardInputGroupImports,
    ZardInputComponent,
    ZardItemImports,
    ZardProgressComponent,
    ZardSelectImports,
    ZardButtonComponent,
  ],
  template: `
    <div class="grid grid-cols-2 gap-(--gap)">
      <z-card>
        <z-card-header>
          <z-card-title zTitle="Savings Targets" />
          <z-card-description zDescription="Active milestones for 2024" />
          <z-card-action>
            <button type="button" z-button zType="outline" zSize="sm">New Goal</button>
          </z-card-action>
        </z-card-header>
        <z-card-content>
          <z-item-group class="gap-3">
            @for (target of targets; track target.label) {
              <z-item zVariant="muted" class="flex-col items-stretch">
                <z-item-content class="gap-3">
                  <p
                    z-item-description
                    class="cn-font-heading text-muted-foreground text-xs font-medium tracking-wider uppercase"
                  >
                    {{ target.label }}
                  </p>
                  <span class="text-3xl font-semibold tabular-nums">{{ target.target }}</span>
                  <z-progress [value]="target.progress" />
                </z-item-content>
                <z-item-footer>
                  <span class="text-muted-foreground text-sm">{{ target.progress }}% achieved</span>
                  <span class="text-sm font-medium tabular-nums">{{ target.saved }}</span>
                </z-item-footer>
              </z-item>
            }
          </z-item-group>
        </z-card-content>
        <z-card-footer>
          <z-card-description class="text-center" zDescription="You have not met your targets for this year." />
        </z-card-footer>
      </z-card>
      <z-card>
        <z-card-header>
          <z-card-title zTitle="Buy Investment" />
        </z-card-header>
        <z-card-content class="flex flex-1 flex-col gap-3">
          <z-field-group class="flex-1">
            <z-field>
              <label z-field-label for="p01-invest-amount">Amount to Invest</label>
              <z-input-group>
                <input z-input id="p01-invest-amount" value="1,000.00" />
                <z-input-group-addon>
                  <span z-input-group-text>$</span>
                </z-input-group-addon>
              </z-input-group>
            </z-field>
            <z-field>
              <label z-field-label for="p01-invest-type">Order Type</label>
              <z-select id="p01-invest-type" class="w-full" zValue="market">
                @for (type of orderTypes; track type.value) {
                  <z-select-item [zValue]="type.value">{{ type.label }}</z-select-item>
                }
              </z-select>
              <p z-field-description>Market orders execute at the current price.</p>
            </z-field>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-sm">Estimated Shares</span>
                <span class="text-sm font-semibold tabular-nums">1.95</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-sm">Buying Power</span>
                <span class="text-sm font-semibold tabular-nums">$12,450.00</span>
              </div>
            </div>
          </z-field-group>
        </z-card-content>
        <z-card-footer class="flex-col gap-3">
          <button type="button" z-button class="w-full">Review Order</button>
          <z-card-description
            class="text-center"
            zDescription="Trades are typically executed within minutes during market hours."
          />
        </z-card-footer>
      </z-card>
    </div>
  `,
})
export class Preview01SavingsTargetsComponent {
  protected readonly targets = TARGETS;
  protected readonly orderTypes = ORDER_TYPES;
}
