import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ZardCodeBoxComponent } from '@zard/widget/components/zard-code-box/zard-code-box.component';
import { ComponentData, COMPONENTS } from '@zard/shared/constants/components.constant';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { StepsComponent } from '@zard/domain/components/steps/steps.component';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import { Step } from '@zard/shared/constants/install.constant';
import { DynamicInstallationService } from '@zard/shared/services/dynamic-installation.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'z-component',
  templateUrl: './component.page.html',
  standalone: true,
  imports: [CommonModule, DynamicAnchorComponent, StepsComponent, ZardCodeBoxComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent],
})
export class ComponentPage {
  private readonly titleService = inject(Title);
  private readonly viewportScroller = inject(ViewportScroller);
  activeAnchor?: string;
  componentData?: ComponentData;
  pageTopics: Topic[] = [];
  activeTab = signal<'manual' | 'cli'>('cli');
  installGuide!: { manual: Step[]; cli: Step[] } | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dynamicInstallationService: DynamicInstallationService,
  ) {
    this.activatedRoute.params.subscribe(() => {
      this.loadData();
    });
    this.loadData();
  }

  private loadData() {
    this.viewportScroller.scrollToPosition([0, 0]);

    const componentName = this.activatedRoute.snapshot.paramMap.get('componentName');
    if (!componentName) {
      this.router.navigateByUrl('/');
      return;
    }

    const component = COMPONENTS.find(x => x.componentName === componentName);
    if (!component) {
      this.router.navigateByUrl('/');
      return;
    }

    this.componentData = component;
    this.pageTopics = component.examples.map(example => ({ name: example.name }));
    this.setPageTitle();

    this.installGuide = this.dynamicInstallationService.generateInstallationSteps(componentName);
  }

  setPageTitle() {
    const componentName = this.componentData?.componentName;
    if (componentName) {
      const capitalizedText = componentName[0].toUpperCase() + componentName.slice(1);
      const pageTitle = `${capitalizedText} - zard/ui`;
      this.titleService.setTitle(pageTitle);
    }
  }
}
