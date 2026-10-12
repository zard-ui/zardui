import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartBar, lucideChartLine, lucidePieChart, lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardDialogImports } from '@zard/components/dialog';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardItemImports } from '@zard/components/item';
import { ZardSelectImports } from '@zard/components/select';

import { ExampleImports } from './example.component';

const LARGE_LIST = Array.from({ length: 100 }, (_, i) => i);

const PLANS = [
  { name: 'Starter', description: 'Perfect for individuals getting started.' },
  { name: 'Professional', description: 'Ideal for growing teams and businesses.' },
  { name: 'Enterprise', description: 'Advanced features for large organizations.' },
] as const;

/** shadcn/ui's `select-example`, in zard. */
@Component({
  selector: 'z-select-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardButtonComponent,
    ZardDialogImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardItemImports,
    ZardSelectImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChartBar, lucideChartLine, lucidePieChart, lucideChevronDown })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-select class="w-fit" zPlaceholder="Select a fruit">
          <z-select-group>
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
            <z-select-item zValue="blueberry">Blueberry</z-select-item>
            <z-select-item zValue="grapes" zDisabled>Grapes</z-select-item>
            <z-select-item zValue="pineapple">Pineapple</z-select-item>
          </z-select-group>
        </z-select>
      </z-example>

      <z-example zTitle="With Icons">
        <div class="flex flex-col gap-4">
          <z-select class="w-fit [&_[data-slot=select-trigger]]:h-7" zPlaceholder="Chart Type">
            <z-select-group>
              <z-select-item zValue="line">
                <ng-icon name="lucideChartLine" />
                Line
              </z-select-item>
              <z-select-item zValue="bar">
                <ng-icon name="lucideChartBar" />
                Bar
              </z-select-item>
              <z-select-item zValue="pie">
                <ng-icon name="lucidePieChart" />
                Pie
              </z-select-item>
            </z-select-group>
          </z-select>
          <z-select class="w-fit" zPlaceholder="Chart Type">
            <z-select-group>
              <z-select-item zValue="line">
                <ng-icon name="lucideChartLine" />
                Line
              </z-select-item>
              <z-select-item zValue="bar">
                <ng-icon name="lucideChartBar" />
                Bar
              </z-select-item>
              <z-select-item zValue="pie">
                <ng-icon name="lucidePieChart" />
                Pie
              </z-select-item>
            </z-select-group>
          </z-select>
        </div>
      </z-example>

      <z-example zTitle="With Groups & Labels">
        <z-select class="w-fit" zPlaceholder="Select a fruit">
          <z-select-group>
            <z-select-label>Fruits</z-select-label>
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
            <z-select-item zValue="blueberry">Blueberry</z-select-item>
          </z-select-group>
          <z-select-separator />
          <z-select-group>
            <z-select-label>Vegetables</z-select-label>
            <z-select-item zValue="carrot">Carrot</z-select-item>
            <z-select-item zValue="broccoli">Broccoli</z-select-item>
            <z-select-item zValue="spinach">Spinach</z-select-item>
          </z-select-group>
        </z-select>
      </z-example>

      <z-example zTitle="Large List">
        <z-select class="w-fit" zPlaceholder="Select an item">
          <z-select-group>
            @for (i of largeList; track i) {
              <z-select-item [zValue]="'item-' + i">Item {{ i }}</z-select-item>
            }
          </z-select-group>
        </z-select>
      </z-example>

      <z-example zTitle="Sizes">
        <div class="flex flex-col gap-4">
          <z-select class="w-fit [&_[data-slot=select-trigger]]:h-7" zPlaceholder="Small size">
            <z-select-group>
              <z-select-item zValue="apple">Apple</z-select-item>
              <z-select-item zValue="banana">Banana</z-select-item>
              <z-select-item zValue="blueberry">Blueberry</z-select-item>
            </z-select-group>
          </z-select>
          <z-select class="w-fit" zPlaceholder="Default size">
            <z-select-group>
              <z-select-item zValue="apple">Apple</z-select-item>
              <z-select-item zValue="banana">Banana</z-select-item>
              <z-select-item zValue="blueberry">Blueberry</z-select-item>
            </z-select-group>
          </z-select>
        </div>
      </z-example>

      <z-example zTitle="Subscription Plan">
        <!--
          zard's trigger prints the chosen item's text, so the description is drawn by CSS (content: attr()) to keep
          it out of that text: the trigger shows the plan name, the list shows name and description.
        -->
        <z-select class="w-72" [(zValue)]="plan">
          <z-select-group>
            @for (item of plans; track item.name) {
              <z-select-item [zValue]="item.name">
                <div z-item zSize="xs" class="w-full p-0">
                  <div z-item-content class="gap-0 normal-case">
                    <div z-item-title class="font-sans">{{ item.name }}</div>
                    <p
                      z-item-description
                      class="text-xs font-normal tracking-normal before:content-[attr(data-description)]"
                      [attr.data-description]="item.description"
                    ></p>
                  </div>
                </div>
              </z-select-item>
            }
          </z-select-group>
        </z-select>
      </z-example>

      <z-example zTitle="With Button">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <z-select class="w-fit [&_[data-slot=select-trigger]]:h-7" zPlaceholder="Small">
              <z-select-group>
                <z-select-item zValue="apple">Apple</z-select-item>
                <z-select-item zValue="banana">Banana</z-select-item>
                <z-select-item zValue="blueberry">Blueberry</z-select-item>
              </z-select-group>
            </z-select>
            <button type="button" z-button zType="outline" zSize="sm">Submit</button>
          </div>
          <div class="flex items-center gap-2">
            <z-select class="w-fit" zPlaceholder="Default">
              <z-select-group>
                <z-select-item zValue="apple">Apple</z-select-item>
                <z-select-item zValue="banana">Banana</z-select-item>
                <z-select-item zValue="blueberry">Blueberry</z-select-item>
              </z-select-group>
            </z-select>
            <button type="button" z-button zType="outline">Submit</button>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Popper">
        <z-select class="w-fit" zPlaceholder="Select a fruit" zPosition="popper">
          <z-select-group>
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
            <z-select-item zValue="blueberry">Blueberry</z-select-item>
            <z-select-item zValue="grapes" zDisabled>Grapes</z-select-item>
            <z-select-item zValue="pineapple">Pineapple</z-select-item>
          </z-select-group>
        </z-select>
      </z-example>

      <z-example zTitle="With Field">
        <div z-field>
          <label z-field-label>Favorite Fruit</label>
          <z-select class="w-fit" zPlaceholder="Select a fruit">
            <z-select-group>
              <z-select-item zValue="apple">Apple</z-select-item>
              <z-select-item zValue="banana">Banana</z-select-item>
              <z-select-item zValue="blueberry">Blueberry</z-select-item>
              <z-select-item zValue="grapes">Grapes</z-select-item>
              <z-select-item zValue="pineapple">Pineapple</z-select-item>
            </z-select-group>
          </z-select>
          <p z-field-description>Choose your favorite fruit from the list.</p>
        </div>
      </z-example>

      <z-example zTitle="Invalid">
        <div class="flex flex-col gap-4">
          <z-select class="w-fit" zPlaceholder="Select a fruit" zInvalid>
            <z-select-group>
              <z-select-item zValue="apple">Apple</z-select-item>
              <z-select-item zValue="banana">Banana</z-select-item>
              <z-select-item zValue="blueberry">Blueberry</z-select-item>
              <z-select-item zValue="grapes">Grapes</z-select-item>
              <z-select-item zValue="pineapple">Pineapple</z-select-item>
            </z-select-group>
          </z-select>
          <div z-field data-invalid="true">
            <label z-field-label>Favorite Fruit</label>
            <z-select class="w-fit" zPlaceholder="Select a fruit" zInvalid>
              <z-select-group>
                <z-select-item zValue="apple">Apple</z-select-item>
                <z-select-item zValue="banana">Banana</z-select-item>
                <z-select-item zValue="blueberry">Blueberry</z-select-item>
                <z-select-item zValue="grapes">Grapes</z-select-item>
                <z-select-item zValue="pineapple">Pineapple</z-select-item>
              </z-select-group>
            </z-select>
            <z-field-error>Please select a valid fruit.</z-field-error>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Inline with Input & NativeSelect">
        <div class="flex items-center gap-2">
          <input z-input placeholder="Search..." class="flex-1" />
          <z-select class="w-[140px]" zPlaceholder="Filter">
            <z-select-group>
              <z-select-item zValue="all">All</z-select-item>
              <z-select-item zValue="active">Active</z-select-item>
              <z-select-item zValue="inactive">Inactive</z-select-item>
            </z-select-group>
          </z-select>
          <!-- zard has no NativeSelect: a plain <select> drawn like shadcn's. -->
          <div data-slot="native-select-wrapper" class="relative w-[140px]">
            <select
              data-slot="native-select"
              class="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full min-w-0 appearance-none rounded-lg border bg-transparent py-1 ps-2.5 pe-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
            >
              <option value="" class="bg-[Canvas] text-[CanvasText]">Sort by</option>
              <option value="name" class="bg-[Canvas] text-[CanvasText]">Name</option>
              <option value="date" class="bg-[Canvas] text-[CanvasText]">Date</option>
              <option value="status" class="bg-[Canvas] text-[CanvasText]">Status</option>
            </select>
            <ng-icon
              name="lucideChevronDown"
              aria-hidden="true"
              data-slot="native-select-icon"
              class="text-muted-foreground pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 select-none"
            />
          </div>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <z-select class="w-fit" zPlaceholder="Disabled" zDisabled>
          <z-select-group>
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
            <z-select-item zValue="blueberry">Blueberry</z-select-item>
            <z-select-item zValue="grapes" zDisabled>Grapes</z-select-item>
            <z-select-item zValue="pineapple">Pineapple</z-select-item>
          </z-select-group>
        </z-select>
      </z-example>

      <z-example zTitle="In Dialog">
        <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">Open Dialog</button>
        <z-dialog [(zVisible)]="dialogOpen">
          <z-dialog-header>
            <z-dialog-title>Select Example</z-dialog-title>
            <z-dialog-description>Use the select below to choose a fruit.</z-dialog-description>
          </z-dialog-header>
          <z-select class="w-fit" zPlaceholder="Select a fruit">
            <z-select-group>
              <z-select-item zValue="apple">Apple</z-select-item>
              <z-select-item zValue="banana">Banana</z-select-item>
              <z-select-item zValue="blueberry">Blueberry</z-select-item>
              <z-select-item zValue="grapes">Grapes</z-select-item>
              <z-select-item zValue="pineapple">Pineapple</z-select-item>
            </z-select-group>
          </z-select>
        </z-dialog>
      </z-example>
    </z-example-wrapper>
  `,
})
export class SelectExampleComponent {
  protected readonly largeList = LARGE_LIST;
  protected readonly plans = PLANS;

  protected readonly plan = signal<string | string[]>(PLANS[0].name);
  protected readonly dialogOpen = signal(false);
}
