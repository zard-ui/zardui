import { RouterModule } from '@angular/router';
import { Component, inject, signal, type OnInit } from '@angular/core';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
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

  readonly pageTopics = signal<Topic[]>([{ name: 'why-zardui' }, { name: 'cli' }, { name: 'ai-ready' }, { name: 'open-source' }]);

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }
}
