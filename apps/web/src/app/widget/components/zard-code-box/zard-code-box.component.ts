import { ComponentType } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CopyButtonComponent } from '@highlight/components/copy-button/copy-button.component';
import type { CodeBlockData } from '@highlight/types';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';
import { HyphenToSpacePipe } from '@doc/shared/pipes/hyphen-to-space.pipe';

@Component({
  selector: 'z-code-box',
  imports: [NgComponentOutlet, MarkdownRendererComponent, HyphenToSpacePipe, CodeBlockComponent, CopyButtonComponent],
  templateUrl: './zard-code-box.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ZardCodeBoxComponent {
  readonly componentType = input<string>();
  readonly demoDescription = input<string | undefined>();
  readonly onlyDemo = input<boolean | undefined>(false);
  readonly fullWidth = input<boolean | undefined>(false);
  readonly fullScreen = input<boolean | undefined>(false);
  readonly flexAlign = input<'start' | 'center' | 'end' | undefined>('center');
  readonly column = input<boolean | undefined>(false);
  readonly dynamicComponent = input<ComponentType<unknown>>();
  readonly codeData = input<CodeBlockData>();

  readonly codeCollapsed = signal(true);

  readonly codeBlockData = computed(() => {
    const data = this.codeData();
    if (!data) return undefined;
    return { ...data, expandable: false, copyButton: false };
  });
}
