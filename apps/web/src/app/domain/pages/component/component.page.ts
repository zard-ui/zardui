import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { AiAssistComponent } from '@doc/domain/components/ai-assist/ai-assist.component';

import { ComponentData, COMPONENTS_REGISTRY } from '../../../shared/constants/components.constant';
import { Step } from '../../../shared/constants/install.constant';
import { HyphenToSpacePipe } from '../../../shared/pipes/hyphen-to-space.pipe';
import { DynamicInstallationService } from '../../../shared/services/dynamic-installation.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ZardCodeBoxComponent } from '../../../widget/components/zard-code-box/zard-code-box.component';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { MarkdownRendererComponent } from '../../components/render/markdown-renderer.component';
import { StepsComponent } from '../../components/steps/steps.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-component',
  templateUrl: './component.page.html',
  imports: [
    AiAssistComponent,
    DocContentComponent,
    MarkdownRendererComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    StepsComponent,
    ZardCodeBoxComponent,
    HyphenToSpacePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dynamicInstallationService = inject(DynamicInstallationService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  activeAnchor = 'overview';
  componentData = signal<ComponentData | undefined>(undefined);
  navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'installation', label: 'Installation', type: 'core' },
      { id: 'examples', label: 'Examples', type: 'core', children: [] },
      { id: 'api', label: 'API', type: 'core' },
    ],
  };

  activeTab = signal<'manual' | 'cli'>('cli');
  installGuide = signal<{ manual: Step[]; cli: Step[] } | undefined>(undefined);

  onInstallKeyDown(e: Event, tabList: HTMLElement): void {
    const event = e as KeyboardEvent;
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]')) as HTMLElement[];
    const currentIndex = tabs.findIndex(tab => tab === event.target);

    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      tabs[newIndex].focus();
      // Update active tab based on the focused tab's id
      const activeTabValue = tabs[newIndex].id === 'cli-tab' ? 'cli' : 'manual';
      this.activeTab.set(activeTabValue);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadData());
  }

  private async loadData() {
    const componentName = this.activatedRoute.snapshot.paramMap.get('componentName');
    if (!componentName) {
      this.router.navigateByUrl('/');
      return;
    }

    const entry = COMPONENTS_REGISTRY.find(x => x.componentName === componentName);
    if (!entry) {
      this.router.navigateByUrl('/');
      return;
    }

    const component = await entry.loadData();
    const installGuide = this.dynamicInstallationService.generateInstallationSteps(
      componentName,
      component.installData?.cliAdd,
      component.installData?.manualCode,
      component.installData?.manualDeps,
    );
    this.installGuide.set(installGuide);
    this.componentData.set(component);

    const examplesItem = this.navigationConfig.items.find(item => item.id === 'examples');
    if (examplesItem) {
      examplesItem.children = component.examples.map(example => ({
        id: example.name,
        label: example.name,
        type: 'custom' as const,
      }));
    }
    this.setPageTitle();
  }

  setPageTitle() {
    const componentData = this.componentData();
    if (!componentData) {
      return;
    }
    const { componentName, description } = componentData;
    const ogImage = `og-${componentName}.jpg`;

    if (componentName) {
      this.seoService.setComponentSeo(componentName, description, ogImage);
    }
  }
}
