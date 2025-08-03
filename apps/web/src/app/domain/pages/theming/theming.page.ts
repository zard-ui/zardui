import { RouterModule } from '@angular/router';
import { Component, inject, signal, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import { ZardAccordionComponent, ZardAccordionItemComponent } from '@zard/components/components';

@Component({
  selector: 'z-theming',
  standalone: true,
  imports: [RouterModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent, ZardAccordionComponent, ZardAccordionItemComponent],
  templateUrl: './theming.page.html',
})
export class ThemingPage implements OnInit {
  private titleService = inject(Title);
  private title = 'Theming - zard/ui';
  activeAnchor?: string;

  readonly pageTopics = signal<Topic[]>([
    { name: 'introduction' },
    { name: 'css-variables' },
    { name: 'utility-classes' },
    { name: 'convention' },
    { name: 'variables-list' },
    { name: 'adding-new-colors' },
    { name: 'base-colors' },
    { name: 'other-formats' },
  ]);

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}
