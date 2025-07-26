import { MarkdownModule } from 'ngx-markdown';

import { ComponentType } from '@angular/cdk/overlay';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardMarkdownComponent } from '@zard/domain/components/markdown/markdown.component';

@Component({
  selector: 'z-code-box',
  imports: [CommonModule, MarkdownModule, NgComponentOutlet, ZardButtonComponent, ZardCardComponent, ZardMarkdownComponent],
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
}
