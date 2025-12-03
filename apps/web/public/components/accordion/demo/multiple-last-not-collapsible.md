```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardAccordionItemComponent } from '../accordion-item.component';
import { ZardAccordionComponent } from '../accordion.component';

@Component({
  selector: 'z-demo-accordion-multiple-last-not-collapsible',
  imports: [ZardAccordionComponent, ZardAccordionItemComponent],
  template: `
    <z-accordion zType="multiple" [zDefaultValue]="defaults" [zCollapsible]="false">
      <z-accordion-item zValue="item-1" zTitle="A Study in Scarlet">
        The first case of Sherlock Holmes and Dr. Watson. They investigate a murder in London, which leads to a
        backstory involving Mormons in the U.S. Introduces Holmes’s deductive method.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="The Sign of Four">
        The first case of Sherlock Holmes and Dr. Watson. They investigate a murder in London, which leads to a
        backstory involving Mormons in the U.S. Introduces Holmes’s deductive method.
      </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="The Hound of the Baskervilles">
        Holmes and Watson investigate the legend of a demonic hound haunting the Baskerville family. Set in the eerie
        Dartmoor moorlands, the story involves betrayal and greed.
      </z-accordion-item>
    </z-accordion>
  `,
})
export class ZardDemoAccordionMultipleLastNotCollapsibleComponent {
  readonly defaults: string[] = ['item-1', 'item-3'];
}

```