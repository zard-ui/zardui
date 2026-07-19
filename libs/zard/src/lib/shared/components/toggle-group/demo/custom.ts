import { Component, computed, signal, type TemplateRef, viewChild } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'demo-toggle-group-custom',
  imports: [ZardToggleGroupComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-full">
      <label z-field-label for="fontToggle">Font Weight</label>
      <z-toggle-group
        id="fontToggle"
        zItemClass="flex size-16 flex-col items-center justify-center rounded-xl"
        zMode="single"
        zType="outline"
        zSize="lg"
        [zItems]="items()"
        [zSpacing]="2"
        (valueChange)="onToggleChange($event)"
      />
      <p z-field-description>
        Use
        <code class="bg-muted rounded-md px-1 py-0.5 font-mono">font-{{ fontWeight() }}</code>
        to set the font weight.
      </p>
    </div>

    <ng-template #light>
      <span class="text-2xl leading-none font-light">Aa</span>
      <span class="text-muted-foreground text-xs">Light</span>
    </ng-template>

    <ng-template #normal>
      <span class="text-2xl leading-none font-normal">Aa</span>
      <span class="text-muted-foreground text-xs">Normal</span>
    </ng-template>

    <ng-template #medium>
      <span class="text-2xl leading-none font-medium">Aa</span>
      <span class="text-muted-foreground text-xs">Medium</span>
    </ng-template>

    <ng-template #bold>
      <span class="text-2xl leading-none font-bold">Aa</span>
      <span class="text-muted-foreground text-xs">Bold</span>
    </ng-template>
  `,
})
export default class ToggleGroupCustomComponent {
  readonly light = viewChild<TemplateRef<void>>('light');
  readonly normal = viewChild<TemplateRef<void>>('normal');
  readonly medium = viewChild<TemplateRef<void>>('medium');
  readonly bold = viewChild<TemplateRef<void>>('bold');

  protected readonly fontWeight = signal<string>('');

  readonly items = computed<ZardToggleGroupItem[]>(() => [
    {
      value: 'light',
      template: this.light(),
      ariaLabel: 'Light',
    },
    {
      value: 'normal',
      template: this.normal(),
      ariaLabel: 'Normal',
    },
    {
      value: 'medium',
      template: this.medium(),
      ariaLabel: 'Medium',
    },
    {
      value: 'bold',
      template: this.bold(),
      ariaLabel: 'Bold',
    },
  ]);

  onToggleChange(value: string | string[]) {
    let weight = '';
    if (Array.isArray(value)) {
      [weight] = value;
    } else {
      weight = value;
    }
    this.fontWeight.set(weight);
  }
}
