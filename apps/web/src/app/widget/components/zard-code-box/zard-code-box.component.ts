import { ComponentType } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';

import { HyphenToSpacePipe } from '../../../shared/pipes/hyphen-to-space.pipe';

@Component({
  selector: 'z-code-box',
  imports: [NgComponentOutlet, ZardCardComponent, MarkdownRendererComponent, HyphenToSpacePipe],
  templateUrl: './zard-code-box.component.html',
})
export class ZardCodeBoxComponent {
  readonly componentType = input<string>();
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
    const classes = [];

    if (this.column()) {
      classes.push('[&_ng-component]:grid');
    } else {
      classes.push('[&_ng-component]:flex');
    }

    if (this.fullWidth()) {
      classes.push('[&_ng-component]:w-full', '[&_div:first-child]:w-full');
    }

    if (this.flexAlign()) {
      classes.push(`items-${this.flexAlign()}`);
    }

    return classes.join(' ');
  });
}
