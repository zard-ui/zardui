```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardAccordionItemComponent, ZardAccordionComponent } from '@ngzard/ui/accordion';

@Component({
  selector: 'z-demo-accordion-basic',
  imports: [ZardAccordionComponent, ZardAccordionItemComponent],
  standalone: true,
  template: `
    <z-accordion zDefaultValue="item-2">
      <z-accordion-item zValue="item-1" zTitle="A Study in Scarlet">
        The first case of Sherlock Holmes and Dr. Watson. They investigate a murder in London, which leads to a
        backstory involving Mormons in the U.S. Introduces Holmes’s deductive method.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="The Sign of Four" zDescription="Sir Arthur Conan Doyle">
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
export class ZardDemoAccordionBasicComponent {}

```