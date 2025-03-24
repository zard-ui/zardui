import { Component } from '@angular/core';

import { ZardAccordionComponent } from '../accordion.component';
import { ZardAccordionItemComponent } from '../accordion-item.component';

@Component({
  standalone: true,
  imports: [ZardAccordionComponent, ZardAccordionItemComponent],
  template: `
    <h3 class="mb-4 text-lg font-medium">Single mode with default open item</h3>
    <z-accordion zDefaultValue="item-2" class="mb-6">
      <z-accordion-item zValue="item-1" zTitle="First item (closed by default)"> This item is closed when the accordion first renders. </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Second item (open by default)">
        This item is automatically open when the accordion first renders because its value matches the zDefaultValue.
      </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="Third item (closed by default)"> This item is closed when the accordion first renders. </z-accordion-item>
    </z-accordion>

    <h3 class="mb-4 text-lg font-medium">Multiple mode with default open items</h3>
    <z-accordion zType="multiple" [zDefaultValue]="['item-1', 'item-3']">
      <z-accordion-item zValue="item-1" zTitle="First item (open by default)">
        This item is automatically open when the accordion first renders because its value is included in the zDefaultValue array.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Second item (closed by default)"> This item is closed when the accordion first renders. </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="Third item (open by default)">
        This item is automatically open when the accordion first renders because its value is included in the zDefaultValue array.
      </z-accordion-item>
    </z-accordion>
  `,
})
export class ZardDemoAccordionDefaultValueComponent {}
