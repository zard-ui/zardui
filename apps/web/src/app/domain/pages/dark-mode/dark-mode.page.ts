import { RouterModule } from '@angular/router';
import { Component, inject, signal, type OnInit } from '@angular/core';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import { ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'z-darkmode',
  standalone: true,
  imports: [RouterModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent],
  templateUrl: './dark-mode.page.html',
})
export class DarkmodePage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly title = 'Dark Mode - zard/ui';
  activeAnchor?: string;

  readonly pageTopics = signal<Topic[]>([
    { name: 'introduction' },
    { name: 'custom-variants' },
    { name: 'darkmode-service' },
    { name: 'implementation' },
    { name: 'usage-examples' },
    { name: 'angular-integration' },
  ]);

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }
}
