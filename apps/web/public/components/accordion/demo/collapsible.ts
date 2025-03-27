import { Component } from '@angular/core';

import { ZardAccordionItemComponent } from '../accordion-item.component';
import { ZardAccordionComponent } from '../accordion.component';

@Component({
  standalone: true,
  imports: [ZardAccordionComponent, ZardAccordionItemComponent],
  template: `
    <z-accordion [zCollapsible]="true" zDefaultValue="item-1" class="mb-6">
      <z-accordion-item zValue="item-1" zTitle="Fully collapsible accordion">
        With the default <code>[zCollapsible]="true"</code> setting, you can close this item even if it's the only one open. Try clicking this item to completely collapse the
        accordion.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Click to expand"> This is another item in the collapsible accordion. </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="Click to expand"> This is yet another item in the collapsible accordion. </z-accordion-item>
    </z-accordion>

    <z-accordion [zCollapsible]="false" zDefaultValue="item-1">
      <z-accordion-item zValue="item-1" zTitle="Non-collapsible accordion">
        With <code>[zCollapsible]="false"</code>, at least one item must remain open at all times. Try clicking this item - it won't close if it's the only one open.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Click to expand"> You can open this item, which will allow you to close the first item. </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="Click to expand"> This is another item in the non-collapsible accordion. </z-accordion-item>
    </z-accordion>
  `,
})
export class ZardDemoAccordionCollapsibleComponent {}
