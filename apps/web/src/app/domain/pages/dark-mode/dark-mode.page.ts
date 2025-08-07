import { RouterModule } from '@angular/router';
import { Component, inject, type OnInit } from '@angular/core';
import { DynamicAnchorComponent, NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
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

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'custom-variants', label: 'Custom Variants', type: 'custom' },
      { id: 'darkmode-service', label: 'Darkmode Service', type: 'custom' },
      { id: 'implementation', label: 'Implementation', type: 'custom' },
      { id: 'usage-examples', label: 'Usage Examples', type: 'custom' },
      { id: 'angular-integration', label: 'Angular Integration', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }
}
