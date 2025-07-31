import { RouterModule } from '@angular/router';
import { Component, signal } from '@angular/core';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-theming',
  standalone: true,
  imports: [RouterModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent],
  templateUrl: './theming.page.html',
})
export class ThemingPage {
  activeAnchor?: string;

  readonly pageTopics = signal<Topic[]>([
    { name: 'introduction' },
    { name: 'convention' },
    { name: 'css-variables' },
    { name: 'base-colors' },
    { name: 'adding-new-colors' },
    { name: 'angular-integration' },
  ]);
}
