import { RouterModule } from '@angular/router';
import { Component, signal } from '@angular/core';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-darkmode',
  standalone: true,
  imports: [RouterModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent],
  templateUrl: './dark-mode.page.html',
})
export class DarkmodePage {
  activeAnchor?: string;

  readonly pageTopics = signal<Topic[]>([
    { name: 'introduction' },
    { name: 'custom-variants' },
    { name: 'darkmode-service' },
    { name: 'implementation' },
    { name: 'usage-examples' },
    { name: 'angular-integration' },
  ]);
}
