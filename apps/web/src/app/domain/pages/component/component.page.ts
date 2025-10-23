import { AiAssistComponent } from '@zard/domain/components/ai-assist/ai-assist.component';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ZardCodeBoxComponent } from '../../../widget/components/zard-code-box/zard-code-box.component';
import { DynamicInstallationService } from '../../../shared/services/dynamic-installation.service';
import { MarkdownRendererComponent } from '../../components/render/markdown-renderer.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ComponentData, COMPONENTS } from '../../../shared/constants/components.constant';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { StepsComponent } from '../../components/steps/steps.component';
import { Step } from '../../../shared/constants/install.constant';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'z-component',
  templateUrl: './component.page.html',
  standalone: true,
  imports: [DocContentComponent, StepsComponent, ZardCodeBoxComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent, AiAssistComponent],
})
export class ComponentPage {
  private readonly seoService = inject(SeoService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dynamicInstallationService = inject(DynamicInstallationService);
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

  constructor() {
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
    const { componentName, description } = this.componentData!;
    const ogImage = `og-${componentName}.jpg`;

    if (componentName) {
      this.seoService.setComponentSeo(componentName, description, ogImage);
    }
  }
}
