import { ZardCardComponent } from '@zard/components/card/card.component';
import { NgComponentOutlet } from '@angular/common';
import { Component, input, signal, computed } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-code-box',
  imports: [NgComponentOutlet, ZardCardComponent, MarkdownRendererComponent],
  templateUrl: './zard-code-box.component.html',
})
export class ZardCodeBoxComponent {
  readonly componentType = input<string>();
  readonly onlyDemo = input<boolean | undefined>(false);
  readonly fullWidth = input<boolean | undefined>(false);
  readonly column = input<boolean | undefined>(false);
  readonly path = input<string>();
  readonly dynamicComponent = input<ComponentType<unknown>>();
  activeTab = signal<'preview' | 'code'>('preview');

  readonly markdownUrl = computed(() => {
    const pathValue = this.path();
    if (!pathValue) return '';
    return `components/${pathValue}.md`;
  });
}
