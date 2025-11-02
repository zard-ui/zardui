```typescript title="libs/blocks/src/lib/my-block/block.ts" expandable="true" copyButton showLineNumbers
import type { Block } from '../../../../apps/web/src/app/domain/components/block-container/block-container.component';
import { MyBlockComponent } from './my-block.component';

export const myBlock: Block = {
  id: 'my-block-01', // Unique block identifier
  title: 'My Block Title',
  description: 'A detailed description of what this block does and when to use it',
  component: MyBlockComponent,
  category: 'dashboard', // Block category
  image: {
    light: '/blocks/my-block-01/light.png',
    dark: '/blocks/my-block-01/dark.png',
  },
  files: [
    {
      name: 'my-block.component.ts',
      path: 'src/components/my-block/my-block.component.ts',
      content: `import { Component } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';

@Component({
  selector: 'z-my-block',
  standalone: true,
  imports: [ZardButtonComponent, ZardCardComponent],
  templateUrl: './my-block.component.html',
})
export class MyBlockComponent {}`,
      language: 'typescript',
    },
    {
      name: 'my-block.component.html',
      path: 'src/components/my-block/my-block.component.html',
      content: `<div class="min-h-screen bg-background p-6">
  <z-card>
    <h1 class="text-2xl font-bold">My Block Title</h1>
    <p class="text-muted-foreground mt-2">Block description goes here.</p>
    <z-button class="mt-4">Get Started</z-button>
  </z-card>
</div>`,
      language: 'html',
    },
  ],
};
```
