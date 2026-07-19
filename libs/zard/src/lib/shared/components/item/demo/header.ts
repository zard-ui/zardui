import { Component } from '@angular/core';

import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Model {
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'z-demo-item-header',
  imports: [...ZardItemImports],
  template: `
    <div class="flex w-full min-w-xl flex-col gap-6">
      <z-item-group class="grid grid-cols-3 gap-4">
        @for (model of models; track model.name) {
          <z-item zVariant="outline">
            <z-item-header>
              <img [src]="model.image" [alt]="model.name" class="aspect-square w-full rounded-sm object-cover" />
            </z-item-header>
            <z-item-content>
              <z-item-title>{{ model.name }}</z-item-title>
              <z-item-description>{{ model.description }}</z-item-description>
            </z-item-content>
          </z-item>
        }
      </z-item-group>
    </div>
  `,
})
export class ZardDemoItemHeaderComponent {
  protected readonly models: Model[] = [
    {
      name: 'v0-1.5-sm',
      description: 'Everyday tasks and UI generation.',
      image: 'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
    },
    {
      name: 'v0-1.5-lg',
      description: 'Advanced thinking or reasoning.',
      image: 'https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop',
    },
    {
      name: 'v0-2.0-mini',
      description: 'Open Source model for everyone.',
      image: 'https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop',
    },
  ];
}
