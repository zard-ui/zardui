import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';

interface Release {
  version: string;
  date: string;
  summary: string;
}

const RELEASES: Release[] = [
  { version: 'v1.4.0', date: 'Aug 12', summary: 'Scroll-driven masks and a smaller runtime.' },
  { version: 'v1.3.2', date: 'Jul 28', summary: 'Focus ring fixes across every overlay.' },
  { version: 'v1.3.0', date: 'Jul 04', summary: 'Signal forms land on every field component.' },
  { version: 'v1.2.1', date: 'Jun 19', summary: 'Dark mode contrast pass on the code blocks.' },
  { version: 'v1.2.0', date: 'Jun 02', summary: 'New chart primitives and a themed tooltip.' },
  { version: 'v1.1.0', date: 'May 21', summary: 'Registry v2, with per-item dependency graphs.' },
];

@Component({
  selector: 'z-utils-scroll-fade-horizontal',
  imports: [ZardCardImports],
  template: `
    <!-- scroll-fade-x tracks the inline axis, so it needs overflow-x-auto to have something to track. -->
    <div class="scroll-fade-x flex w-full max-w-xl gap-4 overflow-x-auto pb-2">
      @for (release of releases; track release.version) {
        <z-card class="w-56 shrink-0">
          <z-card-header>
            <z-card-title>{{ release.version }}</z-card-title>
            <z-card-description>{{ release.date }}</z-card-description>
          </z-card-header>
          <z-card-content>
            <p class="text-muted-foreground text-sm">{{ release.summary }}</p>
          </z-card-content>
        </z-card>
      }
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeHorizontalComponent {
  protected readonly releases = RELEASES;
}
