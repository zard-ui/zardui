import { MarkdownModule } from 'ngx-markdown';

import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ZardMarkdownComponent } from '@zard/domain/components/markdown/markdown.component';
import { SidebarComponent } from '@zard/domain/components/sidebar/sidebar.component';
import { ComponentData, COMPONENTS } from '@zard/shared/constants/components.constant';
import { Installation, installations } from '@zard/shared/constants/install.constant';
import { ZardCodeBoxComponent } from '@zard/widget/components/zard-code-box/zard-code-box.component';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-component',
  templateUrl: './component.page.html',
  standalone: true,
  imports: [CommonModule, DynamicAnchorComponent, MarkdownModule, ZardCodeBoxComponent, ScrollSpyDirective, ScrollSpyItemDirective, SidebarComponent, ZardMarkdownComponent],
})
export class ComponentPage {
  activeAnchor?: string;
  componentData?: ComponentData;
  pageTopics: Topic[] = [];
  activeTab = signal<'manual' | 'cli'>('manual');
  installGuide!: Installation | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
  ) {
    this.activatedRoute.params.subscribe(() => {
      this.loadData();
    });
    this.loadData();
  }

  private loadData() {
    this.viewportScroller.scrollToPosition([0, 0]);

    const guideName = `angular`;

    const installGuide = installations.find(x => x.environment === guideName);
    this.installGuide = installGuide;

    const componentName = this.activatedRoute.snapshot.paramMap.get('componentName');
    if (!componentName) this.router.navigateByUrl('/');

    const component = COMPONENTS.find(x => x.componentName === componentName);
    if (!component) {
      this.router.navigateByUrl('/');
    } else {
      this.componentData = component;
      this.pageTopics = component.examples.map(example => ({ name: example.name }));
    }
  }
}
