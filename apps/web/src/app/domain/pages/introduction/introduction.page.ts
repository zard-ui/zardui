import { RouterModule } from '@angular/router';
import { Component, inject, type OnInit } from '@angular/core';
import { DynamicAnchorComponent, NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { Title } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'z-introduction',
  standalone: true,
  imports: [RouterModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective],
  templateUrl: './introduction.page.html',
})
export class IntroductionPage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly title = 'Introduction - zard/ui';
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'why-zardui', label: 'Why Zardui', type: 'custom' },
      { id: 'cli', label: 'CLI', type: 'custom' },
      { id: 'ai-ready', label: 'AI Ready', type: 'custom' },
      { id: 'open-source', label: 'Open Source', type: 'custom' },
    ],
  };

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }
}
