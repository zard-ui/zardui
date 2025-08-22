import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import { ZardCodeBoxComponent } from '@zard/widget/components/zard-code-box/zard-code-box.component';
import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DynamicInstallationService } from '@zard/shared/services/dynamic-installation.service';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { ComponentData, COMPONENTS } from '@zard/shared/constants/components.constant';
import { StepsComponent } from '@zard/domain/components/steps/steps.component';
import { Step } from '@zard/shared/constants/install.constant';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-component',
  templateUrl: './component.page.html',
  standalone: true,
  imports: [DocContentComponent, StepsComponent, ZardCodeBoxComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent],
})
export class ComponentPage {
  private readonly titleService = inject(Title);
  activeAnchor?: string;
  componentData?: ComponentData;
  navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'installation', label: 'Installation', type: 'core' },
      { id: 'examples', label: 'Examples', type: 'core', children: [] },
      { id: 'api', label: 'API', type: 'core' },
    ],
  };
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

    const examplesItem = this.navigationConfig.items.find(item => item.id === 'examples');
    if (examplesItem) {
      examplesItem.children = component.examples.map(example => ({
        id: example.name,
        label: example.name,
        type: 'custom' as const,
      }));
    }
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
