import { ComponentType } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CopyButtonComponent } from '@highlight/components/copy-button/copy-button.component';
import type { CodeBlockData } from '@highlight/types';

import { AnchorDirective } from '@doc/domain/directives/anchor.directive';
import { ProseDirective } from '@doc/domain/directives/prose.directive';
import type { CodeSnippet } from '@doc/shared/constants/components.constant';
import { HyphenToSpacePipe } from '@doc/shared/pipes/hyphen-to-space.pipe';

@Component({
  selector: 'z-code-box',
  imports: [
    NgComponentOutlet,
    HyphenToSpacePipe,
    CodeBlockComponent,
    CopyButtonComponent,
    ProseDirective,
    AnchorDirective,
  ],
  templateUrl: './zard-code-box.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ZardCodeBoxComponent {
  // Supports single or multiple codeBefore/codeAfter snippets via codeBeforeList/codeAfterList.
  readonly componentType = input<string>();
  readonly demoDescription = input<string | undefined>();
  readonly onlyDemo = input<boolean | undefined>(false);
  readonly fullWidth = input<boolean | undefined>(false);
  readonly fullScreen = input<boolean | undefined>(false);
  readonly flexAlign = input<'start' | 'center' | 'end' | undefined>('center');
  readonly column = input<boolean | undefined>(false);
  readonly fillContainer = input<boolean | undefined>(false);
  readonly dynamicComponent = input<ComponentType<unknown>>();
  readonly codeData = input<CodeBlockData>();
  readonly codeBefore = input<CodeSnippet | CodeSnippet[]>();
  readonly codeAfter = input<CodeSnippet | CodeSnippet[]>();
  /** Optional CSS max-height (e.g. '28rem') overriding the default code block height. */
  readonly codeHeight = input<string>();
  /** Optional CSS min-height (e.g. '32rem') overriding the default preview (component) area height. */
  readonly previewHeight = input<string>();

  readonly codeCollapsed = signal(true);

  readonly codeBeforeList = computed(() => toSnippetList(this.codeBefore()));
  readonly codeAfterList = computed(() => toSnippetList(this.codeAfter()));

  readonly codeBlockData = computed(() => {
    const data = this.codeData();
    if (!data) return undefined;
    return { ...data, expandable: false, copyButton: false };
  });

  readonly previewClasses = computed(() => {
    const base = 'preview relative flex min-h-72 w-full justify-center p-6 md:p-10';
    return this.fillContainer() ? `${base} [&>*]:size-full` : base;
  });
}

function toSnippetList(value: CodeSnippet | CodeSnippet[] | undefined): CodeSnippet[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
