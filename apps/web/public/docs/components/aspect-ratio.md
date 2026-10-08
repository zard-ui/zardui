---
title: Aspect Ratio
description: Displays content within a desired ratio.
---

# Aspect Ratio

Displays content within a desired ratio.

## Installation

### CLI

```bash
npx zard-cli@latest add aspect-ratio
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { aspectRatioVariants } from './aspect-ratio.variants';

@Component({
  selector: 'z-aspect-ratio, [z-aspect-ratio]',
  template: `
    <ng-content />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': '"aspect-ratio"',
    '[style.aspectRatio]': 'zRatio()',
    '[class]': 'classes()',
  },
  exportAs: 'zAspectRatio',
})
export class ZardAspectRatioComponent {
  readonly zRatio = input<number | string>(1);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(aspectRatioVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const aspectRatioVariants = cva('block');
export type ZardAspectRatioVariants = VariantProps<typeof aspectRatioVariants>;
```

```angular-ts
export * from './aspect-ratio.component';
export * from './aspect-ratio.variants';
```

## Usage

```angular-ts
import { ZardAspectRatioComponent } from '@/shared/components/aspect-ratio/aspect-ratio.component';
```

```angular-html
<z-aspect-ratio [zRatio]="16 / 9"></z-aspect-ratio>
```

## Examples

### Image

```angular-ts
import { Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-image',
  imports: [ZardAspectRatioComponent],
  template: `
    <div z-aspect-ratio [zRatio]="16 / 9" class="w-full overflow-hidden rounded-lg md:w-94">
      <img src="/images/placeholder.svg" alt="Cover" class="size-full object-cover" />
    </div>
  `,
})
export class ZardDemoAspectRatioImageComponent {}
```

### Embed

```angular-ts
import { Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-embed',
  imports: [ZardAspectRatioComponent],
  template: `
    <z-aspect-ratio zRatio="4 / 3" class="w-[420px] overflow-hidden rounded-md border">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="Video embed"
        class="size-full"
        allowfullscreen
      ></iframe>
    </z-aspect-ratio>
  `,
})
export class ZardDemoAspectRatioEmbedComponent {}
```

### Avatar

```angular-ts
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../../avatar';
import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-avatar',
  imports: [ZardAspectRatioComponent, ZardAvatarComponent],
  template: `
    <z-aspect-ratio class="w-36 overflow-hidden rounded-full border">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" class="size-full" />
    </z-aspect-ratio>
  `,
})
export class ZardDemoAspectRatioAvatarComponent {}
```

### Card Grid

```angular-ts
import { Component } from '@angular/core';

import {
  ZardCardComponent,
  ZardCardContentComponent,
  ZardCardDescriptionComponent,
  ZardCardHeaderComponent,
  ZardCardTitleComponent,
} from '../../card';
import { ZardAspectRatioComponent } from '../aspect-ratio.component';

interface GridCard {
  title: string;
  description: string;
  body: string;
}

@Component({
  selector: 'z-demo-aspect-ratio-card-grid',
  imports: [
    ZardAspectRatioComponent,
    ZardCardComponent,
    ZardCardHeaderComponent,
    ZardCardDescriptionComponent,
    ZardCardTitleComponent,
    ZardCardContentComponent,
  ],
  template: `
    <div class="grid w-full grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-start gap-4">
      @for (item of items; track item.title) {
        <div z-aspect-ratio [zRatio]="16 / 11">
          <z-card zSize="sm" class="flex size-full flex-col overflow-hidden">
            <z-card-header class="px-4">
              <z-card-title [zTitle]="item.title" />
              <z-card-description [zDescription]="item.description" />
            </z-card-header>

            <z-card-content class="flex-1 px-4">
              <p class="text-muted-foreground text-sm">{{ item.body }}</p>
            </z-card-content>
          </z-card>
        </div>
      }
    </div>
  `,
})
export class ZardDemoAspectRatioCardGridComponent {
  protected readonly items: GridCard[] = [
    {
      title: 'Mountains',
      description: 'Alpine peaks.',
      body: 'A quiet ridge line above the clouds, shot just after sunrise.',
    },
    {
      title: 'Forest',
      description: 'Morning canopy.',
      body: 'Dense pine cover with shafts of light breaking through the mist.',
    },
    { title: 'Ocean', description: 'Calm waters.', body: 'A wide, empty shoreline with the tide pulled far back.' },
    {
      title: 'Desert',
      description: 'Endless dunes.',
      body: 'Rippled sand stretching to the horizon under a clear sky.',
    },
    { title: 'Glacier', description: 'Frozen rivers.', body: 'Blue ice carved slowly over thousands of years.' },
    { title: 'Canyon', description: 'Layered rock.', body: 'Deep red walls cut by a river far below.' },
  ];
}
```

## API Reference

### z-aspect-ratio

Displays content within a desired ratio.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zRatio` | Desired ratio: 16 / 9 or '16 / 9'. Default 1 (square) | `number \| string` | `1` |
| `class` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/aspect-ratio)
