---
title: November 2025 - Carousel and Kbd
description: Major updates this month with new interactive components including Carousel, Button Group, Input Group, and Kbd components. Enhanced user experience with better form controls and keyboard navigation support.
---

# November 2025 - Carousel and Kbd

Major updates this month with new interactive components including Carousel, Button Group, Input Group, and Kbd components. Enhanced user experience with better form controls and keyboard navigation support.

## New Components

### [Carousel](/docs/components/carousel)

A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback.

```
npx zard-cli@latest add carousel
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  selector: 'z-demo-carousel-preview',
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-48 sm:max-w-xs">
      <z-carousel>
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex aspect-square items-center justify-center p-6">
                    <span class="text-4xl font-semibold">{{ slide }}</span>
                  </z-card-content>
                </z-card>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselPreviewComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
```

### [Kbd](/docs/components/kbd)

Display keyboard keys and shortcuts in a visually consistent way.

```
npx zard-cli@latest add kbd
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-preview',
  imports: [ZardKbdComponent, ZardKbdGroupComponent],
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <z-kbd-group>
        <z-kbd>⌘</z-kbd>
        <z-kbd>⇧</z-kbd>
        <z-kbd>⌥</z-kbd>
        <z-kbd>⌃</z-kbd>
      </z-kbd-group>
      <z-kbd-group>
        <z-kbd>Ctrl</z-kbd>
        <span>+</span>
        <z-kbd>B</z-kbd>
      </z-kbd-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoKbdPreviewComponent {}
```
