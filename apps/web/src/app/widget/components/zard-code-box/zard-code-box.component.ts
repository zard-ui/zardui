import { ZardMarkdownComponent } from '@zard/domain/components/components/markdown/markdown.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { Component, input, signal } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'z-code-box',
  imports: [MarkdownModule, NgComponentOutlet, ZardButtonComponent, ZardCardComponent, ZardMarkdownComponent],
  templateUrl: './zard-code-box.component.html',
})
export class ZardCodeBoxComponent {
  readonly componentType = input<string>();
  readonly onlyDemo = input<boolean | undefined>(false);
  readonly path = input<string>();
  readonly dynamicComponent = input<ComponentType<unknown>>();
  activeTab = signal<'preview' | 'code'>('preview');
}
