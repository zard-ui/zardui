import { ComponentType } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';
import { HyphenToSpacePipe } from '@doc/shared/pipes/hyphen-to-space.pipe';

import { ZardCardComponent } from '@zard/components/card/card.component';

@Component({
  selector: 'z-code-box',
  imports: [NgComponentOutlet, ZardCardComponent, MarkdownRendererComponent, HyphenToSpacePipe],
  templateUrl: './zard-code-box.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      z-card.demo-card > div > * {
        min-width: 20rem;
        gap: 1rem;
        align-items: center;
        justify-content: center;
      }

      z-card.demo-card.demo-flex > div > * {
        display: flex;
      }

      z-card.demo-card.demo-grid > div > * {
        display: grid;
      }

      z-card.demo-card.demo-full-width > div > * {
        width: 100%;
      }

      z-card.demo-card.demo-full-width > div {
        width: 100%;
      }
    `,
  ],
})
export class ZardCodeBoxComponent {
  readonly componentType = input<string>();
  readonly demoDescription = input<string | undefined>();
  readonly onlyDemo = input<boolean | undefined>(false);
  readonly fullWidth = input<boolean | undefined>(false);
  readonly fullScreen = input<boolean | undefined>(false);
  readonly flexAlign = input<'start' | 'center' | 'end' | undefined>('center');
  readonly column = input<boolean | undefined>(false);
  readonly path = input<string>();
  readonly dynamicComponent = input<ComponentType<unknown>>();
  activeTab = signal<'preview' | 'code'>('preview');

  readonly markdownUrl = computed(() => {
    const pathValue = this.path();
    if (!pathValue) return '';
    return `components/${pathValue}.md`;
  });

  readonly cardClasses = computed(() => {
    const classes = ['demo-card'];

    if (this.column()) {
      classes.push('demo-grid');
    } else {
      classes.push('demo-flex');
    }

    if (this.fullWidth()) {
      classes.push('demo-full-width');
    }

    if (this.flexAlign()) {
      classes.push(`items-${this.flexAlign()}`);
    }

    return classes.join(' ');
  });
}
